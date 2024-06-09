import React, { useContext, useState, useEffect } from 'react';
import UserProfile from './Profile';
import InfoModal from './InfoModal';
import { AppContext } from '../AppContext';

const Navbar = () => {
    const { isLoggedIn } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
    const [logged, setLogged] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const setLoggedProfile = (() => {
        if (isLoggedIn) {
            setLogged(true)
        } else {
            setLogged(null)
        }
    })

    useEffect(() => {
        setLoggedProfile()
    }, [isLoggedIn]);
    return (
        <div className='bg-background z-1 position-sticky top-0 pb-4 w-100 px-3 pt-3'>
            <div className="d-flex justify-content-between align-items-center navbar">
                <i className="bi h4 bi-info-circle position-absolute start-0 m-0" onClick={handleShowModal}></i>
                <h3 className="mx-auto mb-0">ineednewmusic</h3>
                <div className="position-absolute end-0">
                    {logged &&
                        <UserProfile />
                    }
                </div>
            </div>
            <InfoModal show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Navbar;
