const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
let positions = [
  { id: '1', code: 'MB-ENG-001', title: 'Senior Backend Engineer', department: 'Engineering', location: 'Bengaluru', status: 'Vacant', budget: 2500000, req: 'REQ-1001' },
  { id: '2', code: 'MB-PRO-002', title: 'Product Manager', department: 'Product', location: 'Remote', status: 'Filled', budget: 1800000, req: 'REQ-1002' }
];
app.get('/api/positions', (req, res) => res.json(positions));
app.post('/api/positions', (req, res) => { const p = Object.assign({ id: Date.now().toString() }, req.body); positions.unshift(p); res.json(p); });
app.post('/api/webhook/trakstar', (req, res) => { try{ const payload = req.body; positions = positions.map(pos=>pos.req===payload.requisition_id?Object.assign({},pos,{status:payload.status}):pos); return res.status(200).send('ok'); }catch(e){console.error(e);return res.status(500).send('error')} });
const port = process.env.PORT || 8080;
// Update a position (partial update) - e.g., status
app.put('/api/positions/:id', (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body || {};
    let updated = null;
    positions = positions.map(pos => {
      if (String(pos.id) === String(id)) {
        updated = Object.assign({}, pos, payload);
        return updated;
      }
      return pos;
    });
    if (!updated) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});
// friendly root route so GET / won't return 404
app.get('/', (req, res) => {
  res.status(200).send('API is running. Use GET /api/positions to list positions.');
});
app.listen(port, ()=>console.log('Server running on', port));
