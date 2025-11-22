import { useState, useEffect } from 'react';
import { supabase } from '@/supabase-client';
import { useAuth } from '@/context/AuthContext';
import type { UserProfile } from '@/components/types/userProfile';
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  other_user: UserProfile
  last_message?: Message;
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { user } = useAuth(); // Your auth context

  // Get or create conversation with another user
 // Get or create conversation with another user

const getOrCreateConversation = async (otherUserId: string): Promise<string | null> => {
  if (!user) {
    console.log('No user found');
    return null;
  }

  // Prevent user from creating conversation with themselves
  if (user.id === otherUserId) {
    console.log('Cannot create conversation with yourself');
    return null;
  }

  try {
    console.log('Checking for existing conversation between:', user.id, 'and', otherUserId);
    
    // Better query using multiple conditions
    const { data: existingConversations, error: checkError } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .or(`user1_id.eq.${otherUserId},user2_id.eq.${otherUserId}`);

    if (checkError) {
      console.error('Error checking existing conversations:', checkError);
      throw checkError;
    }

    console.log('Found conversations:', existingConversations);

    // Filter to find the exact conversation between these two users
    const exactConversation = existingConversations?.find(conv => 
      (conv.user1_id === user.id && conv.user2_id === otherUserId) ||
      (conv.user1_id === otherUserId && conv.user2_id === user.id)
    );

    if (exactConversation) {
      console.log('Found existing conversation:', exactConversation.id);
      return exactConversation.id;
    }

    // Create new conversation - ensure user1_id is always the smaller ID to avoid duplicates
    const user1Id = user.id < otherUserId ? user.id : otherUserId;
    const user2Id = user.id < otherUserId ? otherUserId : user.id;

    console.log('Creating new conversation between:', user1Id, 'and', user2Id);
    const { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert([
        {
          user1_id: user1Id,
          user2_id: user2Id,
        }
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      
      // If it's a unique constraint violation, try to find the conversation again
      if (createError.code === '23505') {
        console.log('Unique constraint violation, searching for existing conversation...');
        const { data: retryConversations } = await supabase
          .from('conversations')
          .select('*')
          .eq('user1_id', user1Id)
          .eq('user2_id', user2Id)
          .single();
        
        if (retryConversations) {
          console.log('Found conversation after constraint violation:', retryConversations.id);
          return retryConversations.id;
        }
      }
      throw createError;
    }

    console.log('Successfully created conversation:', newConversation?.id);
    return newConversation?.id || null;
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    return null;
  }
};

  // Send a message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !content.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim(),
          }
        ]);

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  // Fetch conversations for current user
  const fetchConversations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            id,
            content,
            created_at,
            sender_id,
            is_read
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id})`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Process conversations to get other user info and last message
      const processedConversations = await Promise.all(
        (data || []).map(async (conversation) => {
          const otherUserId = conversation.user1_id === user.id ? conversation.user2_id : conversation.user1_id;
          
          // Fetch other user's profile (you might need to adjust this based on your profiles table)
          const { data: otherUser } = await supabase
            .from('user_profiles')
            .select('id, email, full_name, avatar_url') // Adjust fields as needed
            .eq('id', otherUserId)
            .single();

          const lastMessage = conversation.messages?.[0] || null;

          return {
            ...conversation,
            other_user: otherUser || { id: otherUserId, email: 'Unknown User' },
            last_message: lastMessage,
          };
        })
      );

      setConversations(processedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to new messages in a conversation
  const subscribeToMessages = (conversationId: string) => {
    if (!conversationId) return;

    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Mark messages as read
  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    sending,
    getOrCreateConversation,
    sendMessage,
    fetchMessages,
    subscribeToMessages,
    markAsRead,
    fetchConversations,
  };
};