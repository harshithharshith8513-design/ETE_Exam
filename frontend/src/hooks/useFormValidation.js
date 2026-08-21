import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues = {}) => {
  const [values, setValues] = useState({
    title: initialValues.title || '',
    problemStatement: initialValues.problemStatement || '',
    description: initialValues.description || '',
    domain: initialValues.domain || '',
    technologies: initialValues.technologies || [],
    expectedImpact: initialValues.expectedImpact || '',
    status: initialValues.status || 'submitted'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value, allValues = values) => {
    let error = '';

    switch (name) {
      case 'title':
        if (!value || !value.trim()) {
          error = 'Title is required';
        } else if (value.trim().length < 5) {
          error = 'Title must be at least 5 characters long';
        }
        break;

      case 'problemStatement':
        if (!value || !value.trim()) {
          error = 'Problem statement is required';
        }
        break;

      case 'description':
        if (!value || !value.trim()) {
          error = 'Description is required';
        } else if (value.trim().length < 20) {
          error = `Description must be at least 20 characters (current: ${value.trim().length})`;
        }
        break;

      case 'domain':
        if (!value || value === '' || value === 'Select Domain') {
          error = 'Please select a valid domain';
        }
        break;

      case 'technologies':
        if (!Array.isArray(value) || value.length === 0) {
          error = 'At least 1 technology tag is required';
        }
        break;

      case 'expectedImpact':
        if (!value || !value.trim()) {
          error = 'Expected impact field is required';
        }
        break;

      default:
        break;
    }

    return error;
  }, [values]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const nextValues = { ...prev, [name]: value };
      if (touched[name]) {
        const fieldError = validateField(name, value, nextValues);
        setErrors((prevErr) => ({ ...prevErr, [name]: fieldError }));
      }
      return nextValues;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const setTechnologies = (techList) => {
    setValues((prev) => {
      const nextValues = { ...prev, technologies: techList };
      const fieldError = validateField('technologies', techList, nextValues);
      setErrors((prevErr) => ({ ...prevErr, technologies: fieldError }));
      return nextValues;
    });
    setTouched((prev) => ({ ...prev, technologies: true }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(values).forEach((key) => {
      const err = validateField(key, values[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched({
      title: true,
      problemStatement: true,
      description: true,
      domain: true,
      technologies: true,
      expectedImpact: true,
      status: true
    });
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues({
      title: '',
      problemStatement: '',
      description: '',
      domain: '',
      technologies: [],
      expectedImpact: '',
      status: 'submitted'
    });
    setErrors({});
    setTouched({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    handleChange,
    handleBlur,
    setTechnologies,
    validateAll,
    resetForm
  };
};
