import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const GameOverMessage = ({ gameWon, onRestart }: { gameWon: boolean, onRestart: () => void }) => {
    return (
        <Box>
            <Typography variant="h5" color="secondary" align="center" marginTop={2}>
                Game Over, {gameWon ? 'We Won! 🎉' : 'We Lost 😢'}
            </Typography>
            <Box display="flex" justifyContent="center" my={2}>
                <Button variant="contained" color="secondary" onClick={onRestart}>
                    Play Again
                </Button>
            </Box>
        </Box>
    );
};

export default GameOverMessage;
