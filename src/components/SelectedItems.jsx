import React from 'react';

const SelectedItems = ({ selectedTracks, selectedArtists, handleRemoveTrack, handleRemoveArtist }) => (
    <div className='mt-4'>
        {selectedTracks.length > 0 && (
            <>
                <h4 className='ms-2 fw-bold'>Tracks</h4>
                <ul className='bg-secondary rounded p-3 mx-2 mt-2 gap-3 d-flex flex-column'>
                    {selectedTracks.map(track => (
                        <li className='d-flex align-items-center justify-content-between' key={track.id}>
                            <div className='d-flex'>
                                <img src={track.picture} alt={track.name} style={{ width: '50px', height: '50px' }} />
                                <div className='d-flex flex-column ms-3'>
                                    <span className=' fw-bold text-truncate' style={{ maxWidth: '50vw' }}>{track.name}</span>
                                    <span>{track.artist}</span>
                                </div>
                            </div>
                            <i onClick={() => handleRemoveTrack(track.id)} className="bi bi-dash-circle-fill text-black h3 ms-2 m-0 pt-1"></i>
                        </li>
                    ))}
                </ul>
            </>
        )}

        {selectedArtists.length > 0 && (
            <>
                <h4 className='ms-2 fw-bold mt-4'>Artists</h4>
                <ul className='bg-secondary rounded p-3 mx-2 mt-2 gap-3 d-flex flex-column'>
                    {selectedArtists.map(artist => (
                        <li className='d-flex align-items-center justify-content-between' key={artist.id}>
                            <div className='d-flex align-items-center'>
                                <img src={artist.picture} alt={artist.name} style={{ width: '50px', height: '50px' }} />
                                <div className='d-flex flex-column ms-3'>
                                    <span>{artist.name}</span>
                                </div>
                            </div>
                            <i onClick={() => handleRemoveArtist(artist.id)} className="bi bi-dash-circle-fill text-black h3 ms-2 m-0 pt-1"></i>
                        </li>
                    ))}
                </ul>
            </>
        )}
    </div>
);

export default SelectedItems;
