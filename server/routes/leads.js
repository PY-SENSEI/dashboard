import express from 'express';
import Lead from '../models/Lead.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all leads
router.get('/', async (req, res, next) => {
  try {
    const { status, source, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by source
    if (source) {
      query.source = source;
    }

    // Search by firstName, lastName, email, or company
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Lead.countDocuments(query);
    
    const leads = await Lead.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    // Transform leads to match frontend format (convert _id to id)
    const data = leads.map(lead => {
      const leadObj = lead.toObject();
      return {
        ...leadObj,
        id: leadObj._id.toString(),
        _id: undefined
      };
    });

    res.json({
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
});

// Get lead statistics (must be before /:id route)
router.get('/stats', async (req, res, next) => {
  try {
    // Get all leads to calculate stats
    const leads = await Lead.find();
    
    const total = leads.length;
    const converted = leads.filter(lead => lead.status === 'won').length;
    const lost = leads.filter(lead => lead.status === 'lost').length;
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;
    
    // Group by status
    const byStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    
    // Group by source
    const bySource = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate values
    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const wonValue = leads
      .filter(lead => lead.status === 'won')
      .reduce((sum, lead) => sum + (lead.value || 0), 0);
    const pipelineValue = leads
      .filter(lead => !['won', 'lost'].includes(lead.status))
      .reduce((sum, lead) => sum + (lead.value || 0), 0);
    const averageValue = total > 0 ? totalValue / total : 0;

    res.json({
      total,
      converted,
      lost,
      conversionRate,
      byStatus,
      bySource,
      totalValue,
      wonValue,
      pipelineValue,
      averageValue
    });
  } catch (error) {
    next(error);
  }
});

// Get single lead
router.get('/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const leadObj = lead.toObject();
    res.json({
      ...leadObj,
      id: leadObj._id.toString(),
      _id: undefined
    });
  } catch (error) {
    next(error);
  }
});

// Create lead
router.post('/', async (req, res, next) => {
  try {
    const leadData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const lead = new Lead(leadData);
    await lead.save();

    const populatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    const leadObj = populatedLead.toObject();
    res.status(201).json({
      ...leadObj,
      id: leadObj._id.toString(),
      _id: undefined
    });
  } catch (error) {
    next(error);
  }
});

// Update lead
router.put('/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const leadObj = lead.toObject();
    res.json({
      ...leadObj,
      id: leadObj._id.toString(),
      _id: undefined
    });
  } catch (error) {
    next(error);
  }
});

// Delete lead
router.delete('/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
});



export default router;
