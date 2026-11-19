const d = window.DEMO_DATA;
const sum = a => a.reduce((x,y)=>x+y,0);
const base = sum(d.baseline), current = sum(d.current);
const paid = sum(d.cohorts.map(x=>x.paid)), customers = sum(d.cohorts.map(x=>x.base));
document.querySelector('#growth').textContent = `+${((current-base)/base*100).toFixed(1)}%`;
document.querySelector('#conversion').textContent = `${(paid/customers*100).toFixed(1)}%`;
const max = Math.max(...d.baseline,...d.current);
d.labels.forEach((label,i)=>{
 const group=document.createElement('div');group.className='bar-group';
 group.innerHTML=`<div class="bar" style="height:${d.baseline[i]/max*88}%"></div><div class="bar new" style="height:${d.current[i]/max*88}%"></div><span class="bar-label">${label}</span>`;
 document.querySelector('#bars').append(group);
 const tr=document.createElement('tr');tr.innerHTML=`<th scope="row">${label}</th><td>${d.baseline[i]}</td><td>${d.current[i]}</td>`;document.querySelector('#chart-data').append(tr);
});
const metricCopy={
 amount:`<p class="eyebrow">METRIC CONTRACT</p><h3>증가율의 분모부터 확인합니다.</h3><p>두 가상 기간은 각각 6주입니다. 결제액 합계는 기준 ${base}, 비교 ${current}입니다. 금액은 통화가 아닌 임의 단위입니다.</p><p class="formula">(${current} − ${base}) ÷ ${base} × 100 = ${((current-base)/base*100).toFixed(1)}%</p><p class="caution">결제액은 회계상 매출이나 개인 영업 실적과 같지 않습니다. 이 데모는 실제 성과를 나타내지 않습니다.</p>`,
 conversion:`<p class="eyebrow">DENOMINATOR FIRST</p><h3>전체 평균 뒤의 고객군을 봅니다.</h3><p>가상 신규 고객 60명 중 18명, 재방문 고객 40명 중 20명이 구매했습니다. 전체 전환은 ${paid} ÷ ${customers} = ${(paid/customers*100).toFixed(1)}%입니다.</p><p class="formula">신규 30% / 재방문 50%</p><p class="caution">고객군 구성과 관찰 기간이 다르면 전체 비율만 비교할 수 없습니다. 아래 주간 금액 차트와는 별개의 가상 코호트 예제입니다.</p>`,
 quality:`<p class="eyebrow">TRUST BEFORE TRENDS</p><h3>0건과 미수집은 다릅니다.</h3><p>실제 원본에서는 최신 관측일, 열 이름 변화, 추출 행 한도와 요약 값 불일치를 점검했습니다.</p><p class="formula">최신성 → 구조 → 합계 대조</p><p class="caution">이 화면에는 실시간 연결이 없습니다. ‘정상’ 상태를 가장하지 않고 운영 시 확인할 항목을 설명합니다.</p>`
};
function selectMetric(key){document.querySelector('#metric-detail').innerHTML=metricCopy[key];document.querySelectorAll('[data-metric]').forEach(b=>{const on=b.dataset.metric===key;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)});}
document.querySelectorAll('[data-metric]').forEach(b=>b.addEventListener('click',()=>selectMetric(b.dataset.metric)));selectMetric('amount');
const steps=[
 ['고객이 줄었나, 데이터가 멈췄나?','관찰된 하락을 해석하기 전에 원천 자료의 마지막 갱신 시점과 열 구조를 확인합니다. 빈 값이 생겼다고 고객 행동이 사라졌다고 판단하지 않습니다.','확인된 원본: 데이터 건강 점검, 헤더 매핑, 최신 관측일 기준 집계.'],
 ['더 큰 숫자보다, 같은 기준의 비교.','달력상 같은 기간을 비교하는 질문과 운영 일정에 따라 구매를 묶는 질문은 다릅니다. 어느 쪽을 쓰든 시작·종료일과 예외를 함께 보여줘야 합니다.','확인된 원본: 월 귀속 예외와 일별 합계 대조.'],
 ['전체 평균이 서로 다른 고객을 숨기지 않게.','신규 고객과 재구매 고객, 초기 사용 고객과 이탈 고객은 상황이 다릅니다. 활동 고객만 남긴 비교가 이탈한 고객을 지워버리지 않는지도 확인합니다.','확인된 원본: 가입 코호트, 구매 후 사용 단계, 생존 편향을 줄이려는 필터 조정.'],
 ['설명 가능한 이유와, 아직 모르는 이유.','특정 하루의 구매 집중이나 가입부터 구매까지의 시차를 먼저 살핍니다. 그 후 고객 대화로 시간·가격·효용에 대한 가설을 검토합니다. 함께 움직였다는 이유만으로 원인이라고 말하지 않습니다.','확인된 원본: 마감일 집중도·기저 효과와 가입→구매 시차. 고객 대화 검증은 분석을 이어가는 방법입니다.'],
 ['다음 행동과 검증 기준을 함께 남기기.','누가 어떤 고객에게 어떤 후속 조치를 할지 연결합니다. 그 다음은 대상·관찰 기간·성공 지표를 미리 정해 다시 보는 것입니다.','확인된 원본: 후속 연락 목록과 제외 조건. 추가 제안: 비교 집단을 둔 효과 검증. 검증된 인과 효과를 주장하지 않습니다.']
];
function selectStep(i){const s=steps[i];document.querySelector('#step-detail').innerHTML=`<h3>${s[0]}</h3><p>${s[1]}</p><p class="evidence">${s[2]}</p>`;document.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.step)===i));}
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>selectStep(Number(b.dataset.step))));selectStep(0);
