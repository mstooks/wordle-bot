import React, { useState, useEffect, useRef } from 'react';
import { Container, CircularProgress, Box, Typography, Button, Link } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Layout from './components/Layout';
import Header from './components/Header';
import GuessDisplay from './components/GuessDisplay';
import { fetchWordleResult, WordleRequest } from './api/api';
import './index.css';
import tappingGif from './assets/tapping.gif';
import FeedbackForm from './components/FeedbackForm';
import HowToUseModal from './components/HowToUseModal';

function App() {
    const { enqueueSnackbar } = useSnackbar();
    const [guessHistory, setGuessHistory] = useState<{ guess: string, feedback: string[] }[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gameWon, setGameWon] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const [showTappingGif, setShowTappingGif] = useState(false);

    const interactionTimeoutRef = useRef<number>(0);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        startGame();
    
        // Set a timeout to show the tapping animation after 6 seconds
        interactionTimeoutRef.current = setTimeout(() => {
            if (!userInteracted) {
                setShowTappingGif(true);
            }
        }, 6000) as unknown as number;
        
    
        // Clear the timeout when the component unmounts or the game restarts
        return () => {
            clearTimeout(interactionTimeoutRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    const restartGame = async () => {
        setGuessHistory([]);
        setGameOver(false);
        setGameWon(false);
        setLoading(true);
        setUserInteracted(false);
        setShowTappingGif(false);
        await startGame();
    };
    

    const handleFeedbackSubmit = async () => {
        setLoading(true);
        if (guessHistory.length > 0) {
            const currentGuess = guessHistory[guessHistory.length - 1];
            const filledFeedback = currentGuess.feedback.map(f => f || 'x');
            const clue = filledFeedback.join('');
    
            const requestPayload: WordleRequest = guessHistory.map(entry => ({
                word: entry.guess,
                clue: entry.feedback.join('') || 'xxxxx'
            }));
    
            // Add the current guess with its feedback to the request payload
            requestPayload.push({ word: currentGuess.guess, clue });
    
            if (clue === "ggggg") {
                enqueueSnackbar('🎉 Well done! We won the game!', { variant: 'success', autoHideDuration: 6500 });
                setGameOver(true);
                setGameWon(true);
                return;
            }
    
            if (guessHistory.length >= 6 && clue !== "ggggg") {
                enqueueSnackbar('We lost the game 😭 Better Luck next time!', { variant: 'warning', autoHideDuration: 6500 });
                setGameOver(true);
                return;
            }
    
            try {
                const wordleResponse = await fetchWordleResult(requestPayload);
                const newFeedback = wordleResponse.guess.split('').map((letter, index) => {
                    if (currentGuess.guess[index] === letter && filledFeedback[index] === 'g') {
                        return 'g';
                    }
                    return '';
                });
                setGuessHistory([...guessHistory, { guess: wordleResponse.guess, feedback: newFeedback }]);
            } catch (error) {
                const errorMessage = (error as Error).message;

                if (errorMessage.includes('no remaining words in the dictionary')) {
                    enqueueSnackbar('The requested items eliminates all the words in the dictionary (i.e. not solvable), please re-check your selections.', { variant: 'error' });
                } else if (errorMessage.includes('Failed to fetch')) {
                    enqueueSnackbar('Failed to fetch the next guess (API may be down or there was an issue in the request)', { variant: 'error' });
                } else if (errorMessage.includes('string property that is 5 characters long')) {
                    enqueueSnackbar('Your response is somehow longer than 5 characters, no cheating!', { variant: 'error' });
                } else if (errorMessage.includes('must have a valid state object as the HTTP body')) {
                    enqueueSnackbar('The request body is empty. Please provide a valid state object.', { variant: 'error' });
                } else if (errorMessage.includes('state must be an array')) {
                    enqueueSnackbar('The state must be an array. Please provide a valid array of guesses.', { variant: 'error' });
                } else if (errorMessage.includes('state must be an array with 0-5 items in it')) {
                    enqueueSnackbar('The state array must contain 0-5 items. Please provide a valid number of guesses.', { variant: 'error' });
                } else if (errorMessage.includes('state item at index 0 is not a valid object')) {
                    enqueueSnackbar('One of the items in the state array is not a valid object. Please provide valid objects for all guesses.', { variant: 'error' });
                } else if (errorMessage.includes('word string property with invalid characters')) {
                    enqueueSnackbar('The word field contains invalid characters. Please provide a valid 5-letter word using only alpha characters.', { variant: 'error' });
                } else if (errorMessage.includes('clue string property with invalid characters')) {
                    enqueueSnackbar('The clue field contains invalid characters. Please provide a valid clue using only "g", "y", or "x" characters.', { variant: 'error' });
                } else {
                    console.error('An unexpected error occurred:', error);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const startGame = async () => {
        try {
            const initialGuess = await fetchWordleResult([]);
            setGuessHistory([{ guess: initialGuess.guess, feedback: Array(5).fill('') }]);
        } catch (error) {
            enqueueSnackbar('Failed to fetch the initial guess.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const updateFeedback = (index: number, feedback: string) => {
        if (loading || gameOver) return; // Prevent updating feedback while loading
        setUserInteracted(true);
        setShowTappingGif(false);
        clearTimeout(interactionTimeoutRef.current);
        const updatedHistory = [...guessHistory];
        const currentFeedback = updatedHistory[updatedHistory.length - 1].feedback;
        currentFeedback[index] = feedback;
        // Ensure the feedback is always 5 characters long by filling in 'x' for empty slots
        const filledFeedback = currentFeedback.map(f => f || 'x');
        updatedHistory[updatedHistory.length - 1].feedback = filledFeedback;
        setGuessHistory(updatedHistory);
    };
    
    
    const lockedIndexes = guessHistory.reduce((acc, curr, index) => {
        //This keeps already known/correct characters from being edited 
        if (index < guessHistory.length - 1) {
            curr.feedback.forEach((f, i) => {
                if (f === 'g') acc.add(i);
            });
        }
        return acc;
    }, new Set());

    return (
        <Layout>
            <Container maxWidth="sm">
                <Header />
                <Box display="flex" justifyContent="center">
                    <Link component="button" variant="body2" onClick={handleOpenModal}>
                        How to Use
                    </Link>
                </Box>
                {loading && guessHistory.length === 0 && (
                    <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                        <CircularProgress />
                        <Typography variant="h6" marginLeft={2}>
                            Loading initial guess
                        </Typography>
                    </Box>
                )}
                {guessHistory.map((entry, index) => (
                    <Box key={index} position="relative">
                        <GuessDisplay
                            guess={entry.guess}
                            feedback={entry.feedback}
                            onFeedbackUpdate={updateFeedback}
                            isCurrentGuess={index === guessHistory.length - 1}
                            lockedIndexes={index === guessHistory.length - 1 ? Array.from(lockedIndexes) as number[] : []}
                            loading={loading}
                        />
                    {!userInteracted && showTappingGif && index === guessHistory.length - 1 && (
                        <Box
                            component="img"
                            src={tappingGif}
                            alt="Tap here"
                            className="fade-in"
                            sx={{
                                position: 'absolute',
                                top: 'calc(50% + 23px)',
                                left: '52.5%',
                                transform: 'translate(-50%, -50%)',
                                width: '3rem',
                                height: '3rem',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                    </Box>
                ))}
                {gameOver && (
                    <Typography variant="h5" color="secondary" align="center" marginTop={2}>
                        Game Over, { gameWon ? "We Won! 🎉" : "We Lost 😢"}
                    </Typography>
                )}
                {guessHistory.length > 0 && !gameOver && (
                    <FeedbackForm
                        loading={loading}
                        gameOver={gameOver}
                        onSubmitFeedback={handleFeedbackSubmit}
                    />
                )}
                {gameOver && (
                    <Box display="flex" justifyContent="center" my={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={restartGame}
                        >
                            Play Again
                        </Button>
                    </Box>
                )}
                <HowToUseModal open={openModal} onClose={handleCloseModal} />
            </Container>
        </Layout>
    );
}

export default function WrappedApp() {
    return (
        <SnackbarProvider maxSnack={3}>
        <App />
    </SnackbarProvider>
);
}
