import React from 'react';
import { Box, Typography } from '@mui/material';

const GuessDisplay = ({ guess, feedback, onFeedbackUpdate, isCurrentGuess, lockedIndexes, loading }: { 
    guess: string; 
    feedback: string[]; 
    onFeedbackUpdate: (index: number, newFeedback: string) => void; 
    isCurrentGuess: boolean; 
    lockedIndexes: number[]; 
    loading: boolean;
}) => {
    const handleClick = (index: number) => {
        if (!loading && isCurrentGuess && !lockedIndexes.includes(index)) {
            const newFeedback = feedback[index] === 'y' ? 'g' : feedback[index] === 'g' ? '' : 'y';
            onFeedbackUpdate(index, newFeedback);
        }
    };

    const getBackgroundColor = (value: string) => {
        switch (value) {
            case 'g':
                return '#6aaa64';
            case 'y':
                return '#c9b458';
            default:
                return '#fff';
        }
    };

    return (
        <Box display="flex" justifyContent="center" my={2}>
            {guess.split('').map((letter, index) => (
                <Box
                    key={index}
                    onClick={() => handleClick(index)}
                    sx={{
                        width: '3rem',
                        height: '3rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0.25rem',
                        border: '1px solid #ccc',
                        backgroundColor: getBackgroundColor(feedback[index]),
                        cursor: (!loading && isCurrentGuess && !lockedIndexes.includes(index)) ? 'pointer' : 'default',
                    }}
                >
                    <Typography variant="h5" component="span">
                        {letter.toUpperCase()}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default GuessDisplay;
