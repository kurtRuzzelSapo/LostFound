
const loading = () => {
 return (
   <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
     <div className="relative">
       <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
       <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-emerald-200 opacity-30" />
     </div>
     <p className="text-sm text-zinc-500 animate-pulse">
       Loading, please wait...
     </p>
   </div>
 );
}

export default loading