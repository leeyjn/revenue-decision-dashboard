"""Explicit period contracts using synthetic payment records."""
from datetime import date


def total(rows, start, end, period_overrides=None, target_period=None):
    start, end = date.fromisoformat(start), date.fromisoformat(end)
    if start > end:
        raise ValueError('start must not exceed end')
    overrides = period_overrides or {}
    selected = []
    seen = set()
    for row in rows:
        if row['event_id'] in seen:
            raise ValueError('Duplicate payment event')
        seen.add(row['event_id'])
        day = date.fromisoformat(row['date'])
        belongs = overrides.get(row['date'], row['date'][:7])
        if start <= day <= end and (target_period is None or belongs == target_period):
            selected.append(row)
    return {'amount': sum(r['amount'] for r in selected), 'count': len(selected)}


def growth(current, baseline):
    return None if baseline == 0 else (current - baseline) / baseline * 100


def health(latest_date, as_of, expected_headers, actual_headers, max_lag_days=2):
    lag = (date.fromisoformat(as_of) - date.fromisoformat(latest_date)).days
    missing = sorted(set(expected_headers) - set(actual_headers))
    return {'usable': 0 <= lag <= max_lag_days and not missing,
            'lag_days': lag, 'missing_headers': missing}


if __name__ == '__main__':
    import json
    from pathlib import Path
    data = json.loads(Path(__file__).with_name('data.json').read_text())
    print(json.dumps({'synthetic': True, 'baseline': sum(data['baseline']),
                      'current': sum(data['current']),
                      'growth_pct': growth(sum(data['current']), sum(data['baseline']))}, indent=2))
