// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../styles/Report.css";

// const Report = () => {
//   const navigate = useNavigate();
//   const [reports, setReports] = useState([]);

//   // Fetch data from the backend
//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/reports'); // Replace with your actual API endpoint
//         const data = await response.json();
//         // Group sessions by child name
//         const groupedReports = data.reduce((acc, curr) => {
//           const { childname, sessionid } = curr;
//           if (!acc[childname]) {
//             acc[childname] = { childname, sessions: [] };
//           }
//           acc[childname].sessions.push({ sessionid });
//           return acc;
//         }, {});
//         setReports(Object.values(groupedReports)); // Convert grouped object to array
//       } catch (error) {
//         console.error("Error fetching reports:", error);
//       }
//     };

//     fetchReports();
//   }, []);

//   const handleAnalyze = (sessionId) => {
//     console.log(`Analyze clicked for Session ID: ${sessionId}`);
//     // Implement the logic for analyzing a session
//   };

//   return (
//     <div className="report-screen">
//       <h1>Admin Report</h1>
      
//       {/* Scroll to Top Button */}
//       {/* <button className="scroll-top-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
//         ↑
//       </button> */}

//       {/* Table Wrapper */}
//       <div className="report-table-wrapper">
//         <table className="report-table">
//           <thead>
//             <tr>
//               <th>S.No</th>
//               <th>Child Name</th>
//               <th>Session IDs</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reports.map((report, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{report.childname}</td>
//                 <td>
//                   {report.sessions.map((session, i) => (
//                     <div key={i}>{session.sessionid}</div>
//                   ))}
//                 </td>
//                 <td>
//                   {report.sessions.map((session, i) => (
//                     <button
//                       key={i}
//                       onClick={() => handleAnalyze(session.sessionid)}
//                       className="analyze-button"
//                     >
//                       Analyze 
//                     </button>
//                   ))}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <button className="back-button" onClick={() => navigate("/")}>
//         Back to Start
//       </button>
//     </div>
//   );
// };

// export default Report;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Report.css";

const Report = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:3000/reports'); // Replace with your actual API endpoint
        const data = await response.json();

        // Group sessions by child name
        const groupedReports = data.reduce((acc, curr) => {
          const { childname, sessionid } = curr;
          if (!acc[childname]) {
            acc[childname] = { childname, sessions: [] };
          }
          acc[childname].sessions.push({ sessionid });
          return acc;
        }, {});

        setReports(Object.values(groupedReports));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleAnalyze = async (childname, sessionid) => {
    // try {
    //   const response = await fetch("http://127.0.0.1:5000/analyze", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       childname,
    //       sessionid: sessionId,
    //     }),
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     console.error("Error analyzing session:", errorData.error);
    //     return;
    //   }

    //   const analysisResults = await response.json();
    //   console.log("Analysis results:", analysisResults);

    //   // Optionally, display results on the UI or save them to state
    //   alert(`Analysis completed for session: ${sessionId}`);
    // } catch (error) {
    //   console.error("Error analyzing session:", error);
    // }
    try {
      const response = await fetch("http://localhost:3000/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
                childname,
                sessionid: sessionid,
              }),
      })
      if (response.ok) {
        const result = await response.json();
        alert("Folder sent successfully!");
        console.log(result);
      } else {
        alert("Failed to send folder.");
      }
    } catch (error) {
      console.error("Error sending folder:", error);
      alert("Error sending folder.");
    }
  };

  return (
    <div className="report-screen">
      <h1>Admin Report</h1>
      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Child Name</th>
              <th>Session IDs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{report.childname}</td>
                <td>
                  {report.sessions.map((session, i) => (
                    <div key={i}>{session.sessionid}</div>
                  ))}
                </td>
                <td>
                  {report.sessions.map((session, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnalyze(report.childname, session.sessionid)}
                      className="analyze-button"
                    >
                      Analyze
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Start
      </button>
    </div>
  );
};

export default Report;


