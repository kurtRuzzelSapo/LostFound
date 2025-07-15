# User Flows for Lost & Found System

## 🚨 LOST ITEM FLOW

### 1. **User Loses an Item**

- User realizes they lost something (wallet, phone, keys, etc.)
- User goes to the Lost & Found app

### 2. **Report Lost Item**

- Navigate to "Lost Item" page
- Click the floating "+" button to create new lost item
- Fill out the form:
  - **Item Name** (e.g., "Black iPhone 14")
  - **Description** (e.g., "Black iPhone 14 with red case, has a crack on screen")
  - **Location Lost** (e.g., "Library - 2nd floor study area")
  - **Date & Time Lost** (when they think they lost it)
  - **Upload Photo** (if they have a photo of the item)
- Submit the report

### 3. **Lost Item is Posted**

- Item appears in the "Lost Items" feed
- Other users can see the lost item
- User can track their lost item in their profile

### 4. **Someone Finds the Item**

- Another user finds the item
- They go to "Found Item" page
- Click the floating "+" button to report found item
- Fill out similar form with found details
- Submit the found item report

### 5. **Matching & Notification**

- System should match lost and found items based on:
  - Item description similarity
  - Location proximity
  - Time frame
- Send notifications to both users about potential matches

### 6. **Claiming Process**

- Lost item owner sees potential matches
- They can contact the finder through messaging
- Arrange meeting to verify and claim the item
- Once verified, mark item as "Claimed"

---

## 🎯 FOUND ITEM FLOW

### 1. **User Finds an Item**

- User finds something someone lost
- User goes to the Lost & Found app

### 2. **Report Found Item**

- Navigate to "Found Item" page
- Click the floating "+" button to create new found item
- Fill out the form:
  - **Item Name** (e.g., "Black iPhone 14")
  - **Description** (e.g., "Black iPhone 14 with red case, found near study desk")
  - **Location Found** (e.g., "Library - 2nd floor study area")
  - **Date & Time Found** (when they found it)
  - **Upload Photo** (photo of the found item)
- Submit the report

### 3. **Found Item is Posted**

- Item appears in the "Found Items" feed
- Other users can see the found item
- User can track their found items in their profile

### 4. **Owner Claims the Item**

- Original owner sees the found item
- They contact the finder through messaging
- Arrange meeting to verify ownership
- Once verified, mark item as "Returned"

---

## 💬 MESSAGING SYSTEM FLOW

### 1. **Initiating Contact**

- User sees a potential match (lost/found item)
- Click "Contact" button on the item card
- Opens messaging interface

### 2. **Verification Process**

- **For Lost Items**: Owner provides proof of ownership
  - Describe unique features
  - Provide purchase receipt
  - Show ID if applicable
- **For Found Items**: Finder asks for verification
  - Ask specific questions about the item
  - Request proof of ownership

### 3. **Arranging Meeting**

- Agree on meeting location and time
- Exchange contact information if needed
- Set up safe meeting point

### 4. **Handover Process**

- Meet in person
- Verify item and ownership
- Complete handover
- Mark item as "Claimed" or "Returned"

---

## 🔄 ITEM STATUS FLOW

### Status Options:

1. **Active** - Item is posted and available
2. **Pending** - Contact has been initiated
3. **Claimed** - Item has been successfully returned
4. **Expired** - Item has been posted for too long (e.g., 30 days)

### Status Transitions:

- **Active** → **Pending** (when contact is initiated)
- **Pending** → **Claimed** (when item is successfully returned)
- **Active** → **Expired** (after 30 days)
- **Pending** → **Active** (if claim falls through)

---

## 📱 APP FEATURES NEEDED

### Current Features (✅):

- ✅ Post lost items
- ✅ Post found items
- ✅ View all items
- ✅ User profiles
- ✅ Edit/delete own posts

### Missing Features (🔄):

- 🔄 **Messaging System** - Direct communication between users
- 🔄 **Matching Algorithm** - Suggest potential matches
- 🔄 **Status Management** - Track item status (Active/Pending/Claimed)
- 🔄 **Notifications** - Alert users of potential matches
- 🔄 **Search & Filters** - Find specific items
- 🔄 **Verification System** - Prove ownership
- 🔄 **Meeting Scheduler** - Arrange safe handovers
- 🔄 **Feedback System** - Rate successful returns

---

## 🎯 PRIORITY IMPLEMENTATION

### Phase 1 (Core Features):

1. **Messaging System** - Enable communication
2. **Status Management** - Track item states
3. **Basic Matching** - Simple description matching

### Phase 2 (Enhanced Features):

1. **Advanced Matching Algorithm**
2. **Notifications System**
3. **Verification Tools**

### Phase 3 (Advanced Features):

1. **Meeting Scheduler**
2. **Feedback System**
3. **Analytics Dashboard**

---

## 💡 USER EXPERIENCE TIPS

### For Lost Item Owners:

- Be specific in descriptions
- Include unique identifying features
- Upload clear photos if available
- Respond quickly to potential matches

### For Found Item Finders:

- Be honest about item condition
- Take clear photos
- Note exact location found
- Be patient with verification process

### General Safety:

- Meet in public places
- Bring a friend if possible
- Verify ownership thoroughly
- Trust your instincts
