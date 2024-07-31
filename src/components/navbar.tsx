import "./navbar.css";
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import useGlobalState from "../context/GlobalState";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


const Navbar: React.FC = () => {
  const { logout, token } = useGlobalState();
  const user = useGlobalState().user;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="navbar">
      <header className="center-row">
        <div className="logo center-column">
          <Link to="profile" className="a flex items-center p-2 text-white rounded-lg hover:bg-[#70000e] group">
            {
              user?.photo ? <img src={`http://localhost:8000/${user?.photo}`} className="h-6 me-3 sm:h-7 rounded-full" alt="Profile Photo" /> : <div className='bg-[#ECECEC] rounded-full w-7 h-7'><FontAwesomeIcon icon={faUser} className="edit-icon" size="1x" color='#b5b5b5' /></div>
            }
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">{`${user?.first_name}`}</span>
          </Link>
        </div>

        <nav className="nav-menu">
          <input type="checkbox"
            id="chek-option"
            checked={isOpen}
            onChange={toggleMenu}
            className="nav-checkbox" />

          <div className="nav-btn">
            <label htmlFor="chek-option">
              <span></span>
              <span></span>
              <span></span>
            </label>
          </div>

          <div className={classNames('nav-options', 'center-row', { open: isOpen })}>
            <Link to="/" className="flex items-center p-2 text-white rounded-lg hover:bg-[#70000e] group">
              <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75 group-hover:text-[#b27f00]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
              </svg>
              <span className="ms-1 whitespace-nowrap flex-1">Home</span>
            </Link>
            <Link to="/profile" className="flex items-center p-2 text-white rounded-lg hover:bg-[#70000e] group">
              <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75 group-hover:text-[#b27f00]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd" />
              </svg>
              <span className="flex-1 ms-1 whitespace-nowrap">Profile</span>
            </Link>
            <a href="#" className="flex items-center p-2 text-white rounded-lg hover:bg-[#70000e] group" onClick={logout}>
              <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75 group-hover:text-[#b27f00]" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
              </svg>
              <span className="flex-1 ms-1 whitespace-nowrap">Log Out</span>
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;