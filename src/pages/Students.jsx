import { useState, useEffect, memo } from "react";
import { Navbar } from "../components/layout/Navbar";
import { MdSchool } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../firebase/firestore";

// Memoized Student Card
const StudentCard = memo(({ student, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white/5 backdrop-blur-xl rounded-lg p-6 shadow-lg transition-transform hover:scale-105 cursor-pointer border border-white/10 ${
      student.isAlumni ? "ring-2 ring-amber-600" : ""
    }`}
  >
    <div className="flex items-center gap-4 mb-4">
      <img
        src={student.avatar}
        alt={student.name}
        className="w-16 h-16 rounded-full border-2 border-amber-600 object-cover"
        loading="lazy"
      />
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white">{student.name}</h3>
        <p className="text-amber-600 text-sm">@{student.username}</p>
      </div>
    </div>

    {student.isAlumni && (
      <div className="mb-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-600 text-white text-xs rounded-full">
          <FaUserGraduate /> Alumni
        </span>
      </div>
    )}

    <div className="space-y-2 text-sm">
      {student.course && (
        <div className="flex items-center gap-2 text-white font-semibold text-xs">
          <span className="uppercase bg-amber-500 rounded-2xl shadow shadow-amber-300 px-2">{student.course}</span>
          {student.year && (
            <span className="bg-amber-500 rounded-2xl shadow shadow-amber-300 px-2">
              Year {student.year}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
));

StudentCard.displayName = "StudentCard";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const users = await getAllUsers();
        setStudents(users);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Students</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => navigate(`/user/${student.username}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Students;
