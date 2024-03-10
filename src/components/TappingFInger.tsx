import React from 'react';
import { Box } from '@mui/material';
import tappingGif from '../assets/tapping.gif';
import '../styles/TappingFinger.css';

const TappingFinger = () => {
    return (
        <Box
            component="img"
            src={tappingGif}
            alt="Tap here"
            className="fade-in-out"
            sx={{
                position: 'absolute',
                top: 'calc(50% + 23px)',
                left: '52.5%',
                transform: 'translate(-50%, -50%)',
                width: '2.25rem',
                height: '2.25rem',
                pointerEvents: 'none',
            }}
        />
    );
};

export default TappingFinger;
