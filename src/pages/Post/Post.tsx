import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { IconButton, styled } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface FormValues {
  title: string;
  author: string;
  creationDate: string;
  content: string;
}

const initialFormValues: FormValues = {
  title: '',
  author: '',
  creationDate: '',
  content: '',
};

const HearderWrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}));

const DateInput: React.FC<{
  label: string;
  onChange: (value: string) => void;
  value: string;
}> = ({ label, onChange, value }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handleFocus called');
    e.preventDefault();
    setFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setFocused(false);
    }
  };

  return (
    <TextField
      fullWidth
      label={focused ? label : ''}
      name="creationDate"
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={handleBlur}
      InputProps={{
        endAdornment: (
          <IconButton
            type="button"
            size="small"
            edge="end"
            aria-label="calendar"
            onClick={handleFocus}
          >
            <CalendarTodayIcon />
          </IconButton>
        ),
      }}
    />
  );
};

const Post: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [disabled, setDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await axios.post(
        'http://localhost:3000/api/v1/posts',
        formValues
      );
      console.log('Respuesta del servidor:', response.data);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitError(
        'Error al enviar el formulario. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (submitSuccess) {
      timeoutId = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [submitSuccess]);

  useEffect(() => {
    const isValid = Object.values(formValues).every(
      (value) => value.trim() !== ''
    );
    setDisabled(!isValid);
  }, [formValues]);

  return (
    <Container maxWidth="md">
      <HearderWrapper>
        <Typography variant="h4" align="center" gutterBottom>
          Entrada
        </Typography>
      </HearderWrapper>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Título"
          name="title"
          value={formValues.title}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Autor"
          name="author"
          value={formValues.author}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <DateInput
          label="Fecha de Creación"
          onChange={(value) =>
            setFormValues((prevValues) => ({
              ...prevValues,
              creationDate: value,
            }))
          }
          value={formValues.creationDate}
        />
        <TextField
          fullWidth
          label="Contenido"
          name="content"
          multiline
          rows={4}
          value={formValues.content}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => history.back()}
          sx={{ marginRight: '1rem' }}
        >
          Volver
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={disabled || submitting}
        >
          {submitting ? 'Enviando...' : 'Enviar'}
        </Button>
        {submitError && (
          <Typography variant="body2" color="error">
            {submitError}
          </Typography>
        )}
        {submitSuccess && (
          <Typography variant="body2" color="success">
            ¡Formulario enviado con éxito!
          </Typography>
        )}
      </form>
    </Container>
  );
};

export default Post;
