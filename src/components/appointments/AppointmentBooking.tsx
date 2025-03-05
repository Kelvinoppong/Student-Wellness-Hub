import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Chip,
  styled,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format, addDays, isAfter, isBefore, setHours, setMinutes } from 'date-fns';
import { Schedule, Person, Assignment, CheckCircle } from '@mui/icons-material';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';

const counselors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Academic Counseling',
    availability: 'Mon-Fri',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Mental Health',
    availability: 'Mon-Thu',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Career Guidance',
    availability: 'Tue-Fri',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
];

const appointmentTypes = [
  'Academic Counseling',
  'Mental Health Support',
  'Career Guidance',
  'Personal Development',
  'Stress Management',
];

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const CounselorCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const steps = ['Select Appointment Type', 'Choose Counselor', 'Select Date & Time', 'Confirm Details'];

export const AppointmentBooking: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [appointmentType, setAppointmentType] = useState('');
  const [selectedCounselor, setSelectedCounselor] = useState<typeof counselors[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const { user } = useAuthContext();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const isTimeSlotAvailable = (time: Date) => {
    const hour = time.getHours();
    return hour >= 9 && hour <= 16; // 9 AM to 4 PM
  };

  const handleSubmit = async () => {
    try {
      if (!user || !selectedDate || !selectedTime || !selectedCounselor) {
        throw new Error('Please fill in all required fields');
      }

      const appointmentData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        counselorId: selectedCounselor.id,
        counselorName: selectedCounselor.name,
        appointmentType,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: format(selectedTime, 'HH:mm'),
        reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const appointmentRef = doc(collection(db, 'appointments'));
      await setDoc(appointmentRef, appointmentData);

      setSnackbarMessage('Appointment booked successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Reset form
      setAppointmentType('');
      setSelectedCounselor(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setReason('');
      setActiveStep(0);
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Error booking appointment');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {appointmentTypes.map((type) => (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <StyledCard
                  onClick={() => {
                    setAppointmentType(type);
                    handleNext();
                  }}
                  sx={{
                    bgcolor: appointmentType === type ? 'primary.light' : 'background.paper',
                    cursor: 'pointer',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Schedule a session for {type.toLowerCase()}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            {counselors.map((counselor) => (
              <Grid item xs={12} sm={6} md={4} key={counselor.id}>
                <CounselorCard
                  onClick={() => {
                    setSelectedCounselor(counselor);
                    handleNext();
                  }}
                  elevation={selectedCounselor?.id === counselor.id ? 4 : 1}
                >
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Avatar
                      src={counselor.image}
                      alt={counselor.name}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Typography variant="h6">{counselor.name}</Typography>
                    <Chip label={counselor.specialty} color="primary" size="small" />
                    <Typography variant="body2" color="text.secondary">
                      Available: {counselor.availability}
                    </Typography>
                  </Box>
                </CounselorCard>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                  minDate={addDays(new Date(), 1)}
                  maxDate={addDays(new Date(), 30)}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Select Time"
                  value={selectedTime}
                  onChange={(newTime) => setSelectedTime(newTime)}
                  shouldDisableTime={(time) => !isTimeSlotAvailable(time)}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reason for Appointment"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        );

      case 3:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Type:</strong> {appointmentType}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Counselor:</strong> {selectedCounselor?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Date:</strong> {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Time:</strong> {selectedTime ? format(selectedTime, 'hh:mm a') : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Reason:</strong> {reason}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Book a Counseling Appointment
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 4 }}>{getStepContent(activeStep)}</Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={
            (activeStep === 0 && !appointmentType) ||
            (activeStep === 1 && !selectedCounselor) ||
            (activeStep === 2 && (!selectedDate || !selectedTime || !reason))
          }
        >
          {activeStep === steps.length - 1 ? 'Book Appointment' : 'Next'}
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
