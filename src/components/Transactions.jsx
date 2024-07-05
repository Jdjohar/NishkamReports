import React, { useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const Transactions = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const roundOff = (value) => {
    return (value / 100).toFixed(2);
  };

  const columns = [
    {
      name: 'Id',
      selector: row => row.id,
      width: "4rem",
      sortable: true,
      compact: true,
      center: true,
      wrap: true,
    },

    {
      name: 'amount',
      selector: row => `₹${roundOff(row.amount)}`,
      sortable: true,
      compact: true,
      width: "4rem",
      wrap: true,
    },
    {
      name: 'Captured Date',
      selector: row => new Date(row.captured_at * 1000).toLocaleString(),
      sortable: true,
      compact: true,
      width: "4rem",
      wrap: true,
    },
    {
      name: 'order_id',
      selector: row => row.order_id,
      sortable: true,
      compact: true,
      width: "5rem",
      wrap: true,
    },
    {
      name: 'method',
      selector: row => row.method,
      sortable: true,
      compact: true,
      width: "5rem",
      wrap: true,
    },


    {
      id: 'email',
      name: 'F.Name',
      selector: row => row.email,
      sortable: true,
      reorder: true,
      compact: true,
      width: "10rem",
      wrap: true,
    },


    {
      name: 'contact',
      selector: row => row.contact,
      sortable: true,
      compact: true,
      width: "7rem",
      wrap: true,
    },


    {
      name: 'address',
      selector: row => row.notes.address,
      sortable: true,
      compact: true,
      width: "7rem",
      wrap: true,
    },

    {
      name: 'city',
      selector: row => row.notes.city,
      sortable: true,
      compact: true,
      width: "5rem",
      wrap: true,
    },

    {
      name: 'country',
      selector: row => row.notes.country,
      sortable: true,
      compact: true,
      width: "10rem",
      wrap: true,
    },

    {
      name: 'Name',
      selector: row => row.notes.first_name + ' ' + row.notes.last_name,
      sortable: true,
      compact: true,
      width: "10rem",
      wrap: true,
    },

    {
      name: 'pan_number',
      selector: row => row.notes.pan_number,
      sortable: true,
      compact: true,
      width: "6rem",
      wrap: true,
    },

    {
      name: 'pin_code',
      selector: row => row.notes.pin_code,
      sortable: true,
      compact: true,
      width: "5rem",
      wrap: true,
    },
  ];

  const handleFilter = (event) => {
    const inputValue = event.target.value.toLowerCase();

    if (inputValue === '') {
      setTransactions(transactions);
    } else {
      const newData = transactions.filter(row =>
        row.notes.first_name.toLowerCase().includes(inputValue) ||
        row.notes.last_name.toLowerCase().includes(inputValue) 
        // ...
      );
      setTransactions(newData);
    }
  };

  function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || '|';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  function downloadCSV() {
    var data, filename, link;
    var csv = convertArrayOfObjectsToCSV({
      data: transactions
    });
    if (csv == null) return;

    filename = 'Student_Acedamic_Data' + ' ' + new Date().toLocaleString() + '.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  }


  const fetchTransactions = async () => {
    try {
      const response = await axios.post('https://nishkamapi.onrender.com/api/v1/Razortransactions', {
        from: fromDate,
        to: toDate,
      });
      setTransactions(response.data.items);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const tableHeaderstyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "12px",
        backgroundColor: "#ddd"

      },
    },
  }


  return (
    <div className='container py-5'>
      <h1 className='text-uppercase py-2'>Razorpay Transactions</h1>
      <div className='row'>
        <div className='col'>


          <label>
            From Date:
          </label>
          <input
            type="date"
            value={fromDate}
            className='form-control'
            onChange={(e) => setFromDate(e.target.value)}
          />

        </div>
        <div className='col'>
          <label>
            To Date:</label>
          <input
            type="date"
            value={toDate}
            className='form-control'
            onChange={(e) => setToDate(e.target.value)}
          />

        </div>
        <div className='row my-3'>

          <button className="btn btn-primary" onClick={fetchTransactions}>Fetch Transactions</button>
        </div>
      </div>
      <div>
        <h2>Transactions:</h2>
        <div style={{ width: '100%' }}>

          <div className='row'>

            <div className='col-6'>
<div>
  
              <input type='text'
                placeholder='Search by Name, Code'
                className='block w-full rounded-md border-1 py-1 text-grey-900 shadow-sm ring-1 ring-inset ring-grey-300 placeholder:text-grey-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' onChange={handleFilter}
                />
                </
                div>
              <button type="button" onClick={() => downloadCSV()} className="mt-2 btn btn-success">Download</button>
            </div>
          </div>


          <DataTable
            columns={columns}
            data={transactions}
            customStyles={tableHeaderstyle}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50, 75, 100, 10000]}
            fixedHeader
            responsive
            highlightOnHover
            striped
            className="custom-table "
          />
        </div>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              ID: {transaction.id}, Amount: {roundOff(transaction.amount)}, Status: {transaction.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Transactions;
