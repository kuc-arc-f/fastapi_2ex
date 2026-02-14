//import { Routes, Route, Link } from 'react-router-dom';
import {Link } from 'react-router-dom';
import React, { useState , useEffect } from 'react';

function Page() {
  return (
  <div>
    <a href="/" className="font-bold ms-4" >Home</a>
    <a href="/edit">&nbsp; [ edit ]</a>
    <hr className="my-2" />
  </div>
  );
}
export default Page;
