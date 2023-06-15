'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import UserService from '@/services/UserService';

const NAME_REGEX = /^[A-z][A-z-']{1,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [firstName, setFirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [company, setCompany] = useState('');
  const [companyFocus, setCompanyFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false); // only for console logging

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    // const result = NAME_REGEX.test(firstName);
    // setValidFirstName(result);
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [firstName]);

  useEffect(() => {
    // const result = NAME_REGEX.test(lastName);
    // setValidLastName(result);
    setValidLastName(NAME_REGEX.test(lastName));
  }, [lastName]);

  useEffect(() => {
    // const result = EMAIL_REGEX.test(email);
    // setValidEmail(result);
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    // const result = PWD_REGEX.test(pwd);
    // setValidPwd(result);
    setValidPwd(PWD_REGEX.test(pwd));
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [firstName, lastName, email, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validFirstName ||
      !validLastName ||
      !validEmail ||
      !validPwd ||
      !matchPwd
    ) {
      setErrMsg('Fields marked with a * are required');
      return;
    }
    if (pwd !== matchPwd) {
      setErrMsg('Passwords do not match');
      return;
    }
    try {
      const res = await UserService.register(
        email,
        pwd,
        firstName,
        lastName,
        company
      );
      console.log('res.data: ', res.data);
      console.log('res.user', res.data.user);
      console.log('res.accessToken', res.data.tokens.access);
    } catch (err) {
      if (!err.response) {
        setErrMsg('No server response');
      } else if (err.response?.status === 409) {
        setErrMsg('User already exists');
      } else {
        setErrMsg('Registration failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? 'errmsg' : 'offscreen'}
        aria-live='assertive'
      >
        {errMsg}
      </p>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor='firstName'>
          *First Name:
          <span className={validFirstName ? 'valid' : 'hide'}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validFirstName || !firstName ? 'hide' : 'invalid'}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type='text'
          id='firstName'
          ref={userRef}
          autoComplete='off'
          onChange={(e) => setFirstName(e.target.value)}
          required
          aria-invalid={validFirstName ? 'false' : 'true'}
          aria-describedby='uidnote'
          onFocus={() => setFirstNameFocus(true)}
          onBlur={() => setFirstNameFocus(false)}
        />
        <p
          id='uidnote'
          className={
            firstNameFocus && firstName && !validFirstName
              ? 'instructions'
              : 'offscreen'
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Name must be 2 to 24 characters.
          <br />
          Only letters, hyphens, and apostrophes allowed.
        </p>

        <label htmlFor='lastName'>
          *Last Name:
          <span className={validLastName ? 'valid' : 'hide'}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validLastName || !lastName ? 'hide' : 'invalid'}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type='text'
          id='lastName'
          autoComplete='off'
          onChange={(e) => setLastName(e.target.value)}
          required
          aria-invalid={validLastName ? 'false' : 'true'}
          aria-describedby='uidnote'
          onFocus={() => setLastNameFocus(true)}
          onBlur={() => setLastNameFocus(false)}
        />
        <p
          id='uidnote'
          className={
            lastNameFocus && lastName && !validLastName
              ? 'instructions'
              : 'offscreen'
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Name must be 2 to 24 characters.
          <br />
          Only letters, hyphens, and apostrophes allowed.
        </p>

        <label htmlFor='company'>Company:</label>
        <input
          type='text'
          id='company'
          autoComplete='off'
          onChange={(e) => setCompany(e.target.value)}
          aria-describedby='uidnote'
          onFocus={() => setCompanyFocus(true)}
          onBlur={() => setCompanyFocus(false)}
        />

        <label htmlFor='email'>
          *Email:
          <span className={validEmail ? 'valid' : 'hide'}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validEmail || !email ? 'hide' : 'invalid'}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type='email'
          id='email'
          autoComplete='off'
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={validEmail ? 'false' : 'true'}
          aria-describedby='uidnote'
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
        />
        <p
          id='uidnote'
          className={
            emailFocus && email && !validEmail ? 'instructions' : 'offscreen'
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Email must include @ symbol.
        </p>

        <label htmlFor='password'>
          *Password:
          <FontAwesomeIcon
            icon={faCheck}
            className={validPwd ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validPwd || !pwd ? 'hide' : 'invalid'}
          />
        </label>
        <input
          type='password'
          id='password'
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          aria-invalid={validPwd ? 'false' : 'true'}
          aria-describedby='pwdnote'
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        <p
          id='pwdnote'
          className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          8 to 24 characters.
          <br />
          Must include uppercase and lowercase letters, a number and a special
          character.
          <br />
          Allowed special characters:{' '}
          <span aria-label='exclamation mark'>!</span>{' '}
          <span aria-label='at symbol'>@</span>{' '}
          <span aria-label='hashtag'>#</span>{' '}
          <span aria-label='dollar sign'>$</span>{' '}
          <span aria-label='percent'>%</span>
        </p>

        <label htmlFor='confirm_pwd'>
          *Confirm Password:
          <FontAwesomeIcon
            icon={faCheck}
            className={validMatch && matchPwd ? 'valid' : 'hide'}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validMatch || !matchPwd ? 'hide' : 'invalid'}
          />
        </label>
        <input
          type='password'
          id='confirm_pwd'
          onChange={(e) => setMatchPwd(e.target.value)}
          value={matchPwd}
          required
          aria-invalid={validMatch ? 'false' : 'true'}
          aria-describedby='confirmnote'
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
        <p
          id='confirmnote'
          className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Must match the first password input field.
        </p>

        <button
          className='text-white btn bg-slate-400'
          disabled={
            !validFirstName ||
            !validLastName ||
            !validEmail ||
            !validPwd ||
            !validMatch
              ? true
              : false
          }
        >
          Sign Up
        </button>
      </form>
      <p>
        Already registered?
        <br />
        <span className='line'>
          {/*put router link here*/}
          <a href='#'>Sign In</a>
        </span>
      </p>
    </section>
  );
};

export default Register;
