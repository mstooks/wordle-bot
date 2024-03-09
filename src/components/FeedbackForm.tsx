import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

function FeedbackForm({ loading, gameOver, onSubmitFeedback }: { loading: boolean, gameOver: boolean, onSubmitFeedback: () => void }) {
    const buttonText = loading ? 'Loading' : 'Submit Status';
    const isButtonDisabled = loading || gameOver;

    return (
        <Box display="flex" justifyContent="center" my={2}>
            <Button
                variant="contained"
                color="primary"
                onClick={onSubmitFeedback}
                disabled={isButtonDisabled}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
            >
                {buttonText}
            </Button>
        </Box>
    );
}

export default FeedbackForm;
