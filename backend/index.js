const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Replace existing mapRowToPosition with this flexible version
function mapRowToPosition(row) {
  // Normalize keys: lower, remove non-alphanum
  const normalize = k => (k || '').toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const normRow = {};
  Object.keys(row || {}).forEach(k => {
    normRow[normalize(k)] = row[k];
  });

  // helper to pick first existing field from a list of normalized keys
  const pick = (candidates) => {
    for (const c of candidates) {
      if (normRow[c] !== undefined && normRow[c] !== null && String(normRow[c]).trim() !== '') return normRow[c];
    }
    return undefined;
  };

  // Possible keys based on your sheet headers and common variants
  // ID fields
  const id = pick(['positionid','position_id','id','pid','pid_tag','pidtagginga','pidtaggingb']);

  // Code / tagging
  const code = pick(['pidtagginga','pidtaggingb','pid_tagging_a','pid_tagging_b','pid_tagging','code','rolecode']);

  // Title / designation
  const title = pick(['designation','title','role','positiontitle','jobtitle']);

  // Department mapping: prefer Function -> Sub Function -> Business unit / Function_old
  const department = pick(['function','subfunction','sub_function','businessunit_old','function_old','business_unit_old','businessunit','dept','department']);

  // Location: pid_location, location tagging, pid_state etc.
  const location = pick(['pid_location','location','locationtagging','pid_state','state','city','location_tagging']);

  // Status: not present in your sheet; fall back to Proposed
  const status = (pick(['status','current_status','status_old']) || 'Proposed');

  // Budget — try numeric conversion, support PID_BUDGET and variants
  const budgetRaw = pick(['pid_budget','pidbudget','budget','budget_inr','budget_inr','pid_budget_inr']);
  const budget = (budgetRaw === undefined || budgetRaw === null || String(budgetRaw).trim() === '') ? null : Number(String(budgetRaw).replace(/[^0-9.-]/g, '') || NaN);

  // Req / Leader / owner
  const req = pick(['req','requisition','requisitionid','requisition_id','leader','owner','leadername']);

  // Fallback id generation if none available
  const finalId = id || (code ? String(code) + '-' + Math.random().toString(36).slice(2,6) : String(Date.now()) + Math.random().toString(36).slice(2,6));

  return {
    id: finalId,
    code: code || finalId,
    title: title || (code ? code : 'Untitled'),
    department: department || 'Unknown',
    location: location || '',
    status: (typeof status === 'string' ? status : 'Proposed'),
    budget: Number.isFinite(budget) ? budget : null,
    req: req || null,
    // keep a raw copy for debugging if needed
    _raw: row
  };
}
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
