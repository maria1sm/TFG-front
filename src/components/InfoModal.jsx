// components/InfoModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const InfoModal = ({ show, handleClose }) => (
    <Modal show={show} onHide={handleClose} centered className='text-black text-center'>
        <Modal.Header className='d-flex justify-content-center'>
            <Modal.Title>what is this app?</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column align-items-center gap-2'>
            <p>
                ineednewmusic helps you explore and discover new songs effortlessly using the Spotify algorithm.
            </p>
            <p>
                Simply search for artists or songs, pick up to 5 items from the results, and get a personalized playlist based on your selection.
                You can then save it directly to your Spotify account.</p>
            <p>
                Enjoy fresh tunes and keep your music library exciting!
            </p>
            <p className='text-secondary'>Developed by María Sisamón Márquez</p>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
            <Button className='bg-background border-0' onClick={handleClose}>Got it!</Button>
        </Modal.Footer>
    </Modal>
);

export default InfoModal;
