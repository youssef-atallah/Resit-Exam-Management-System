import { RequestHandler } from "express";
import userDao from "../datastore/dao/userDao";


const signInHandler: RequestHandler = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
  } catch (error) {
    console.error('Error signing in user:', error);
    return res.status(500).json({ error: 'Failed to sign in user' });
  }
};