import React from 'react';

const TrackList = ({ tracks, searchType, handleSelect }) => (
    <div>
        <ul className='bg-secondary rounded p-3 mx-2 mt-2 gap-3 d-flex flex-column'>
            {tracks.map(item => (
                <li className='d-flex align-items-center justify-content-between' key={item.id}>
                    <div className='d-flex'>
                        {searchType === 'track'
                            ? item.album.images[2] && <img src={item.album.images[2]?.url} alt={item.name} style={{ width: '50px', height: '50px' }} />
                            : item.images[2] && <img src={item.images[2]?.url} alt={item.name} style={{ width: '50px', height: '50px' }} />
                        }
                        <div className='d-flex flex-column ms-3'>
                            <span className='fw-bold text-truncate' style={{ maxWidth: '50vw' }}>{item.name}</span>
                            {searchType === 'track' && <span className='artista-cancion'>{item.artists[0].name}</span>}
                        </div>

                    </div>
                    <i className="bi bi-plus-circle-fill h3 ms-2 text-black m-0 pt-1" onClick={() => handleSelect(item)}></i>
                </li>
            ))}
        </ul>
    </div >
);

export default TrackList;
