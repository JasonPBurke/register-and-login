'use client';

import React from 'react';
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '@/app/context/AuthProvider';
import UserService from '@/services/UserService';

const Login = () => {
  const userEmailRef = useRef();
  const errRef = useRef();

  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userEmailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [userEmail, password]);

  const handleSubmit = async (e) => {
    console.log("handling submit");
    e.preventDefault();

    try {
      console.log(userEmail);
      console.log(password);
      const res = await UserService.login(userEmail, password);
      console.log(res);
      console.log(res?.role);
      setUserEmail('');
      setPassword('');
      // setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Email or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Invalid Email or Password');
      } else {
        setErrMsg('Login Failed');
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
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='userEmail'>Email:</label>
        <input
          type='email'
          id='userEmail'
          ref={userEmailRef}
          autoComplete='off'
          onChange={(e) => setUserEmail(e.target.value)}
          value={userEmail}
          required
        />
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button className='text-white btn bg-slate-400'>Sign In</button>
        <p>
          Don&apos;t have an account? <br />
          <span>
            {/* put router link here */}
            <a href='#'>Sign Up</a>
          </span>
        </p>
      </form>
    </section>
  );
};

export default Login;
