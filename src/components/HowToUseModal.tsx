import React from 'react';
import { Box, Typography, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const HowToUseModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography id="modal-title" variant="h6" component="h2">
                    How to Use
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    1. Wait for the initial guess to load.<br />
                    <br></br>
                    2. Click on the letters to cycle through their statuses until it matches your wordle screen.<br />
                    <br></br>
                    3. Once you've set the statuses for all letters, click "Submit Status" to get the next guess.<br />
                    <br></br>
                    4. Repeat steps 2 and 3 until you find the correct word or run out of guesses.<br />
                </Typography>
            </Box>
        </Modal>
    );
};

export default HowToUseModal;
