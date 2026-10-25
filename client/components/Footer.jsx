// "use client";

// export default function Footer() {
//   return (
//     <footer className="bg-gray-800 text-gray-300 text-center py-6 text-sm mt-auto">
//       © {new Date().getFullYear()} Proton Shop. All rights reserved.
//     </footer>
//   );
// }


"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gray-800 text-gray-300 text-center py-6 text-sm mt-auto">
      © {year || "2026"} Proton Shop. All rights reserved.
    </footer>
  );
}