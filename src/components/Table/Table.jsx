import { Table } from "react-bootstrap";

export default function Tbl({ showHeadings = false, headings, rows }) {
  return (
    <>
      <Table borderless hover responsive variant="dark" className="text-center">
        {showHeadings && (
          <thead>
            <tr>
              {Object.values(headings).map((heading, i) => {
                return <th key={i}>{heading}</th>;
              })}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => {
            return (
              <tr key={i}>
                {Object.values(row).map((data, i) => {
                  return <td key={i}>{data}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
