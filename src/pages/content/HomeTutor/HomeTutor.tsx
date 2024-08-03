import { useEffect, useState } from "react";
import useGlobalState from "../../../context/GlobalState";
import authService from "../../../service/auth.service";
import certService from "../../../service/cert.service";
import { Button, Typography } from "@material-tailwind/react";
import { PieChart, Pie, Tooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import "./HomeTutor.css";
import User from "../../../models/User";
import { generalData } from "../../../common/generalData";
import useIsMobile from "../../../hooks/useIsMobile";

const HomeTutor = () => {
  const { user, setUser } = useGlobalState();
  const [visible, setVisible] = useState(user?.is_visible || false);
  const [alsuccess, setAlsuccess] = useState<string | null>(null);
  const [alerror, setAlerror] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('gender'); 
  const [genderCounts, setGenderCounts] = useState([] as { name: string, value: number }[]);
  const [studyAreaCounts, setStudyAreaCounts] = useState([] as { name: string, value: number }[]);

  const isMobile = useIsMobile(); 
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042']; 
  const COLORSBAR = ['#00C49F', '#FF8042', '#FFBB28', '#0088FE']; 

  const updateVisible = async () => {
    const newVisibility = !visible;
    setVisible(newVisibility);

    const res = await authService.updateVisibility(newVisibility);

    if (res.id) {
      setUser({
        ...user,
        is_visible: newVisibility,
      });
      setAlsuccess('Visibility updated successfully');
      setTimeout(() => {
        setAlsuccess(null);
      }, 3000);
    }
  };

  const getUsers = async () => {
    if (user) {
      try {
        const res = await certService.usersbyTutor(user?.id);
        console.log(res);

        countGender(res);
        countStudyArea(res);

      } catch (error) {
        console.error("Error fetching users:", error);
        setAlerror('Failed to fetch users');
        setTimeout(() => {
          setAlerror(null);
        }, 3000);
      }
    }
  };

  const countGender = (users: User[]) => {
    const counts = users.reduce((acc, user) => {
      const genderLabel = generalData.gender.find((g: { value: number; }) => g.value === user.gender)?.label || 'Unknown';
      acc[genderLabel] = (acc[genderLabel] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const data = Object.keys(counts).map(gender => ({
      name: gender,
      value: counts[gender]
    }));
    setGenderCounts(data);
  };

  const countStudyArea = (users: User[]) => {
    const counts = users.reduce((acc, user) => {
      const studyAreaLabel = generalData.study_area.find((area: { value: any; }) => area.value === user.study_area)?.label || 'Unknown';
      acc[studyAreaLabel] = (acc[studyAreaLabel] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const data = Object.keys(counts).map(area => ({
      name: area,
      value: counts[area]
    }));
    setStudyAreaCounts(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="hometutor">
      <div className="alerts-container">
        {alsuccess && <span className="alert-success">{alsuccess}</span>}
        {alerror && <span className="alert-error">{alerror}</span>}
      </div>
      <Typography variant="h1" className="title" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Welcome {user?.first_name}</Typography>
      <div className="btn-container">
        <Button
          placeholder=''
          onPointerEnterCapture={() => { }}
          onPointerLeaveCapture={() => { }}
          onClick={updateVisible}
          color={visible ? 'red' : 'green'}
        >
          {visible ? 'Hide Profile' : 'Show Profile'}
        </Button>
      </div>

      {/* Menú de navegación para las gráficas */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setActiveSection('gender')}
          style={{
            borderBottom: activeSection === 'gender' ? '2px solid #dd971a' : 'none',
            padding: '10px',
            cursor: 'pointer'
          }}
        >
          Gender
        </button>
        <button
          onClick={() => setActiveSection('studyArea')}
          style={{
            borderBottom: activeSection === 'studyArea' ? '2px solid #dd971a' : 'none',
            padding: '10px',
            cursor: 'pointer'
          }}
        >
          Study Area
        </button>
      </div>

      {/* Renderizado de la gráfica activa */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }} className="graphics-container">
        {activeSection === 'gender' && (
          <ResponsiveContainer width="80%" height="100%">
            <PieChart>
              <Pie
                data={genderCounts}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={!isMobile ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
              >
                {genderCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeSection === 'studyArea' && (
          <ResponsiveContainer width="80%" height="100%">
            <BarChart data={studyAreaCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick = {isMobile ? false : true}/>
              <YAxis />
              <Tooltip />
              <Legend content={() => (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {studyAreaCounts.map((entry, index) => (
                    <li key={`item-${index}`} style={{ color: COLORSBAR[index % COLORSBAR.length] }}>
                      <span style={{ color: COLORSBAR[index % COLORSBAR.length], marginRight: 5 }}>■</span>
                      {entry.name}
                    </li>
                  ))}
                </ul>
              )} />
              <Bar dataKey="value" fill="#8884d8">
                {studyAreaCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORSBAR[index % COLORSBAR.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default HomeTutor;
