import { Table } from "react-bootstrap";

export default function Tbl({ showHeadings = false, headings, rows }) {
  const width = 100 / Object.keys(headings).length;
  const widthStyle = {
    width: width.toString() + "%",
  };

  return (
    <>
      <Table borderless hover responsive variant="dark">
        {showHeadings && (
          <thead>
            <tr>
              {Object.values(headings).map((heading, i) => {
                return (
                  <th key={i} style={widthStyle}>
                    {heading}
                  </th>
                );
              })}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => {
            return (
              <tr key={i}>
                {Object.values(row).map((data, i) => {
                  return (
                    <td key={i} style={widthStyle}>
                      {data}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
