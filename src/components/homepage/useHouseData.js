import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHouses } from './houseSlice';
import axios from 'axios';
import