export interface CommandEntryProps {
   children: React.ReactNode;
   location: string;
   result?: string;
}

export default function CommandEntry({ children, location, result }: CommandEntryProps) {
   return (
       // This classes are defined in /src/styles/globals.scss
       <>
           <div className="flex gap8">
               <div className="flex">
                   <span className="location">me@portfolio:</span>
                   <span className="location2">~{location} $</span>
               </div>
               <div className="fill">{children}</div>
           </div>
           {!!result && <div>{result}</div>}
       </>
   );
}
