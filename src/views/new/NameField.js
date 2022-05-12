import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { TextField, Grid, Typography, Alert, Chip, Tooltip, Button, DialogContentText, DialogTitle, DialogActions, Dialog, DialogContent } from '@mui/material';
import Project from 'react-dappify/model/Project';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const NameField = ({ onChange }) => {
    const theme = useTheme();
    const appState = useSelector((state) => state.app);
    const [appName, setAppName] = useState(appState.name);
    const [appSubdomain, setAppSubdomain] = useState(appState.subdomain);
    const [error, setError] = useState();
    const [showEditor, setShowEditor] = useState();

    const generateSubdomain = async (name) => {
        setError();
        if (!name || name.length < 4) {
            setError('Project name and subdomain must be at least 4 characters long');
            return;
        }
        if (name.length > 30) {
            setError('Project name cannot be longer than 30 characters');
            return;
        }
        const regexp = /^[a-zA-Z0-9- ]+$/;
        if (name.search(regexp) === -1) {
            setError('Can only contain letters, numbers, spaces and hyphens');
            return;
        }
        const prefix = name.replace(/\s/g, "").toLowerCase();
        const found = await Project.exists(prefix);
        setError(found ? 'Project subdomain taken, please select a different subdomain' : null);
        setAppSubdomain(prefix);
        setAppName(name);
    };

    useEffect(() => {
        onChange(!error, appName, appSubdomain);
    }, [error, appName, appSubdomain]);

    const projectInfo = `
    A Dappify project is Web3, Ethereum Virtual Machine compatible.
    Templates in this project will share features like Look & feel, User Management and Properties Config.
    When you create a new Dappify project in the Dappify console, you're actually creating a Smart Contract behind the scenes powered by Dappify UI engine.
    `;

    return (
        <Grid container direction="row" justifyContent="left" alignItems="left" spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h1" fontWeight="regular" sx={{ mb: 5 }}>
                    Let's start with a name for<br/>your 
                    <Tooltip title={projectInfo}>
                        <span className="project-keyword">project<HelpOutlineIcon /></span>
                    </Tooltip>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fontSize="3em"
                    placeholder="Enter your project name"
                    variant="standard"
                    defaultValue={appName}
                    onChange={(e) => generateSubdomain(e.target.value)}
                    autoFocus
                    sx={{ 
                        input: { 
                            "&::placeholder": {
                                fontSize: 34,
                                fontWeight: '500',
                                color: 'rgba(0,0,0,0.9)'
                            } 
                        }
                    }} 
                    inputProps={{
                        style: {
                            fontSize: 40,    
                            color:   theme.palette.primary.dark
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="A unique identifier subdomain for your project">
                    <Chip icon={<EditIcon sx={{ fontSize: '1.2em', paddingLeft: 1, width: 25 , opacity: 0.75 }} />} label={`https://${appSubdomain}.dappify.us`}  variant="outlined" onClick={() => setShowEditor(true)}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12} sx={{ p: 0, minHeight: 44 }}>
                { error && (<Alert variant="outlined" severity="error" sx={{ fontSize: "1em", height: 28, border: 0, color: '#c62828' }}>{error}</Alert>)}
            </Grid>

            <Dialog open={showEditor} onClose={() => showEditor(false)}>
                <DialogTitle>Project Subdomain</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your project's globally unique subdomain, used as your URL. You cannot change your project subdomain after project creation.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Project subdomain"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={appSubdomain}
                        onChange={(e) => {generateSubdomain(e.target.value)}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEditor(false)}>Cancel</Button>
                    <Button onClick={() => {
                        setShowEditor(false)
                    }}>Save</Button>
                </DialogActions>
            </Dialog>

        </Grid>
    );
};

export default NameField;
