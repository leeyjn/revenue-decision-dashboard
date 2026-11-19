import unittest
from metrics import total, growth, health

class MetricsTests(unittest.TestCase):
    def setUp(self):
        self.rows = [{'event_id': 'DEMO-P1', 'date': '2026-04-30', 'amount': 40},
                     {'event_id': 'DEMO-P2', 'date': '2026-05-01', 'amount': 20},
                     {'event_id': 'DEMO-P3', 'date': '2026-05-02', 'amount': 30}]
    def test_calendar_boundaries_inclusive(self):
        self.assertEqual(total(self.rows, '2026-05-01', '2026-05-02')['amount'], 50)
    def test_explicit_business_period(self):
        result = total(self.rows, '2026-04-01', '2026-05-01', {'2026-05-01': '2026-04'}, '2026-04')
        self.assertEqual(result, {'amount': 60, 'count': 2})
    def test_override_excluded_from_next_period(self):
        self.assertEqual(total(self.rows, '2026-05-01', '2026-05-31', {'2026-05-01': '2026-04'}, '2026-05')['amount'], 30)
    def test_zero_baseline_is_undefined(self):
        self.assertIsNone(growth(10, 0))
    def test_stale_source_is_not_zero_activity(self):
        self.assertFalse(health('2026-01-01', '2026-01-06', ['date'], ['date'])['usable'])
    def test_schema_drift_blocks_use(self):
        self.assertFalse(health('2026-01-01', '2026-01-01', ['amount'], ['total'])['usable'])
    def test_duplicate_events_rejected(self):
        with self.assertRaises(ValueError): total(self.rows * 2, '2026-04-01', '2026-06-01')
    def test_invalid_window_rejected(self):
        with self.assertRaises(ValueError): total([], '2026-06-01', '2026-01-01')
