import { SetStateAction, useEffect, useState } from "react";
import authService from "../service/auth.service";
import useGlobalState from "../context/GlobalState";
import TutorCard from "../components/TutorCard";
import './home.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { select } from "@material-tailwind/react";
import { generalData } from './../common/generalData';


const Home: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const { user } = useGlobalState();
  const [tutors, setTutors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>(user?.study_area ? user.study_area : "all");

  async function getTutors() {
    const res = await authService.getTutors();
    setTutors(res);
    console.log(selectedFilter);
  }

  useEffect(() => {
    getTutors()
  }, []);

  const handleSelectArea = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedFilter(event.target.value);
    console.log(selectedFilter)
  };

  const getStudyAreaValue = (label: string) => {
    const area = generalData.study_area.find(area =>
      area.label.toLowerCase().includes(label.toLowerCase())
    );
    return area ? area.value : null;
  };

  const filteredTutors = tutors.filter(tutor => {
    const studyAreaValue = getStudyAreaValue(searchTerm);
    const searchPrice = Number(searchTerm);

    const searchMatch = tutor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || (studyAreaValue && tutor.study_area === studyAreaValue) || (searchTerm === '' ? true : Number(tutor.hourly_rate) <= searchPrice);

    return searchMatch;
  });

  return (
    <div className="home">
      <div className="flex row pt-2 search-container">
        <input
          type="text"
          placeholder="Search tutors for Name, Last Name or Price..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <FontAwesomeIcon icon={faSearch} className="edit-icon ml-1 mt-2 " size="2x" color='#b5b5b5' />
      </div>

      <ul className="grid w-full areas-container">
        {generalData.study_area.map((area) => {
          return (
            <li className="gap-1">
              <input checked={selectedFilter === area.value.toString()} onChange={handleSelectArea} type="radio" id={`area-${area.value}`} name="study-area" value={area.value} className="hidden peer" required />
              <label htmlFor={`area-${area.value}`} className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300  dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-[#70000e] peer-checked:text-[#70000e] hover:text-gray-100 hover:bg-[#70000e] dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                <div className="block">
                  <div className="w-full">{area.label}</div>
                </div>
              </label>
            </li>
          )
        })}
      </ul>

      <h3 className="text-r">
        Recommended based on
        <b className="text-[#70000e]">
          {user?.study_area === selectedFilter ? " your ​​study area" : ` ${generalData.study_area[Number(selectedFilter) - 1].label}`}
        </b>
      </h3>
      <div className="cards-container">
        {filteredTutors.filter(tutor => tutor.study_area === Number(selectedFilter)).map((tutor) => {
          return (
            <TutorCard tutor={tutor} />
          )
        })}
      </div>
      <h3 className="text-r">
        Find <b className="text-[#70000e]">all</b> our registered tutors
      </h3>
      <div className="cards-container">
        {filteredTutors.map((tutor) => {
          return (
            <TutorCard tutor={tutor} />
          )
        })}
        {/* {searchTerm === '' ?
          tutors.filter(tutor => tutor.study_area === user?.study_area).map((tutor) => {
            return (
              <TutorCard tutor={tutor} />
            );
          })
          :
          filteredTutors.map((tutor) => {
            console.log(searchTerm === '' ? tutor.first_name : tutor.first_name.toLowerCase().includes(searchTerm.toLowerCase()));
            return (
              <TutorCard tutor={tutor} />
            );
          })
        } */}
      </div>
    </div>

  );
}

export default Home;