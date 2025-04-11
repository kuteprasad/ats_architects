import architectsLogo from "../../../../assets/architectsLogo.png";
import React from 'react';

const CareersPageHeader = () =>  {
  return (
   <div className="bg-white shadow">
   <div className="container mx-auto px-6 py-4">
     <div className="flex items-center space-x-4">
       <img
         src={architectsLogo}
         alt="ATS Architects Logo"
         className="h-12 w-12 rounded-full object-cover"
       />

      <div className="text-center">
         <h1 className="text-2xl font-bold text-center" >Application Portal</h1>
      </div>

     </div>
   </div>
 </div>
  )
};

export default CareersPageHeader;
