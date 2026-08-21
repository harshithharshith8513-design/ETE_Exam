import React, { useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { Tag, Plus, X, AlertCircle, Send } from 'lucide-react';

const DOMAIN_OPTIONS = [
  'Select Domain',
  'AI/ML',
  'HealthTech',
  'FinTech',
  'CleanTech',
  'EdTech',
  'Cybersecurity',
  'IoT / Robotics',
  'Other'
];

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'prototype', label: 'Prototype' },
  { value: 'implemented', label: 'Implemented' }
];

export const IdeaForm = ({ initialValues = {}, onSubmit, submitLabel = 'Submit Idea', isEditing = false }) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setTechnologies,
    validateAll
  } = useFormValidation(initialValues);

  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!values.technologies.includes(cleanTag)) {
      setTechnologies([...values.technologies, cleanTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTechnologies(values.technologies.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateAll()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setServerError(err.message || 'An error occurred while saving the idea');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-300 text-sm font-bold flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Idea Title Input */}
      <div>
        <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
          Idea Title <span className="text-rose-600 dark:text-rose-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. EcoGrid: Autonomous Microgrid Load Balancer"
          className={`w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-[#130924] dark:text-white dark:placeholder-slate-500 text-sm rounded-2xl px-4 py-3 border ${
            touched.title && errors.title
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-slate-300 dark:border-purple-500/30 focus:border-emerald-500 dark:focus:border-purple-400'
          } focus:outline-none transition-colors shadow-sm`}
        />
        {touched.title && errors.title && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.title}</span>
          </p>
        )}
      </div>

      {/* Domain Select Dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
            Domain Sector <span className="text-rose-600 dark:text-rose-400">*</span>
          </label>
          <select
            name="domain"
            value={values.domain}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-white text-slate-900 font-semibold dark:bg-[#130924] dark:text-white text-sm rounded-2xl px-4 py-3 border ${
              touched.domain && errors.domain
                ? 'border-rose-500 ring-1 ring-rose-500'
                : 'border-slate-300 dark:border-purple-500/30 focus:border-emerald-500 dark:focus:border-purple-400'
            } focus:outline-none transition-colors cursor-pointer shadow-sm`}
          >
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d} value={d === 'Select Domain' ? '' : d}>
                {d}
              </option>
            ))}
          </select>
          {touched.domain && errors.domain && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.domain}</span>
            </p>
          )}
        </div>

        {/* Workflow Status Dropdown */}
        <div>
          <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
            Pipeline Stage
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="w-full bg-white text-slate-900 font-semibold dark:bg-[#130924] dark:text-white text-sm rounded-2xl px-4 py-3 border border-slate-300 dark:border-purple-500/30 focus:border-emerald-500 dark:focus:border-purple-400 focus:outline-none cursor-pointer shadow-sm"
          >
            {STATUS_OPTIONS.map((so) => (
              <option key={so.value} value={so.value}>
                {so.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Problem Statement */}
      <div>
        <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
          Problem Statement <span className="text-rose-600 dark:text-rose-400">*</span>
        </label>
        <textarea
          name="problemStatement"
          rows={2}
          value={values.problemStatement}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Briefly state the core pain point or bottleneck your innovation resolves..."
          className={`w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-[#130924] dark:text-white dark:placeholder-slate-500 text-sm rounded-2xl px-4 py-3 border ${
            touched.problemStatement && errors.problemStatement
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-slate-300 dark:border-purple-500/30 focus:border-emerald-500 dark:focus:border-purple-400'
          } focus:outline-none transition-colors shadow-sm`}
        />
        {touched.problemStatement && errors.problemStatement && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.problemStatement}</span>
          </p>
        )}
      </div>

      {/* Detailed Description with 20+ chars counter */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200">
            Detailed Solution Description <span className="text-rose-600 dark:text-rose-400">*</span>
          </label>
          <span
            className={`text-xs font-extrabold ${
              values.description.trim().length >= 20 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'
            }`}
          >
            {values.description.trim().length} / 20+ chars
          </span>
        </div>
        <textarea
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Explain your architectural design, technical mechanics, data pipelines, or workflow details (at least 20 characters required)..."
          className={`w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-[#130924] dark:text-white dark:placeholder-slate-500 text-sm rounded-2xl px-4 py-3 border ${
            touched.description && errors.description
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-slate-300 dark:border-purple-500/30 focus:border-emerald-500 dark:focus:border-purple-400'
          } focus:outline-none transition-colors shadow-sm`}
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.description}</span>
          </p>
        )}
      </div>

      {/* Technology Tags Builder */}
      <div>
        <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
          Technologies & Stack (at least 1 tag required) <span className="text-rose-600 dark:text-rose-400">*</span>
        </label>

        <div className="flex items-center space-x-2 mb-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-slate-400 dark:text-purple-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDownTag}
              placeholder="Add tech tag (e.g. React, TensorFlow, IoT) and press Enter..."
              className="w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-[#130924] dark:text-white text-sm rounded-2xl pl-10 pr-4 py-2.5 border border-slate-300 dark:border-purple-500/30 focus:border-emerald-500 dark:focus:border-purple-400 focus:outline-none shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-purple-600 text-white rounded-2xl text-sm font-bold flex items-center space-x-1 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Selected Tag Badges */}
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-[#130924]/60 rounded-2xl border border-slate-200 dark:border-purple-500/20 min-h-[48px] items-center">
          {values.technologies.length === 0 ? (
            <span className="text-xs text-slate-500 italic font-semibold">No technology tags added yet</span>
          ) : (
            values.technologies.map((t) => (
              <span
                key={t}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-purple-950/70 dark:border-purple-500/40 text-xs font-bold dark:text-purple-200"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
        {touched.technologies && errors.technologies && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.technologies}</span>
          </p>
        )}
      </div>

      {/* Expected Impact Input */}
      <div>
        <label className="block text-sm font-extrabold text-slate-900 dark:text-slate-200 mb-1">
          Expected Impact Metrics <span className="text-rose-600 dark:text-rose-400">*</span>
        </label>
        <input
          type="text"
          name="expectedImpact"
          value={values.expectedImpact}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Reduces carbon emissions by 40% per grid sector or improves ICU survival rates by 35%"
          className={`w-full bg-white text-slate-900 font-semibold placeholder-slate-400 dark:bg-[#130924] dark:text-white dark:placeholder-slate-500 text-sm rounded-2xl px-4 py-3 border ${
            touched.expectedImpact && errors.expectedImpact
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-slate-300 dark:border-purple-500/30 focus:border-emerald-500 dark:focus:border-purple-400'
          } focus:outline-none transition-colors shadow-sm`}
        />
        {touched.expectedImpact && errors.expectedImpact && (
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>{errors.expectedImpact}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-6 rounded-2xl font-black bg-emerald-600 hover:bg-emerald-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white shadow-xl shadow-emerald-600/30 dark:shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{submitLabel}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
