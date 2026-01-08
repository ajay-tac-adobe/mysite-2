export default async function decorate(block) {
  const baseUrl = block.dataset.url || '/customers.json';
  const pageSize = 20;
  let total = 0;
 
  function render(data, page, onPageChange) {
    const totalPages = Math.ceil(total / pageSize);
 
    const ul = document.createElement('ul');
    ul.className = 'customers';
 
    data.forEach((customer) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>${customer['First Name']} ${customer['Last Name']}</h3>
        <p><strong>City:</strong> ${customer.City}, ${customer.Country}</p>
      `;
      ul.appendChild(li);
    });
 
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    pagination.innerHTML = `
      <button ${page === 0 ? 'disabled' : ''} data-action="prev">Previous</button>
      <span>Page ${page + 1} of ${totalPages}</span>
      <button ${page === totalPages - 1 ? 'disabled' : ''} data-action="next">Next</button>
    `;
 
    pagination.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'prev') onPageChange(page - 1);
      if (e.target.dataset.action === 'next') onPageChange(page + 1);
    });
 
    block.replaceChildren(ul, pagination);
  }
 
  async function loadData(page = 0) {
    const url = `${baseUrl}?limit=${pageSize}&offset=${page * pageSize}`;
 
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const json = await response.json();
      total = json.total;
 
      render(json.data, page, loadData);
    } catch {
      block.innerHTML = '<p>Error loading customer data.</p>';
    }
  }
 
  loadData();
}