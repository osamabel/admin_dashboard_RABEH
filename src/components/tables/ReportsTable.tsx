import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useReportStore } from '@/hooks/useReportStore';

interface Report {
  id: string;
  gameName: string;
  reportDate: string;
  reportedBy: string;
}

export function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const { shouldRefetch, setShouldRefetch } = useReportStore();

  const fetchReports = async () => {
    try {
      const response = await fetch('/reports/get');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (shouldRefetch) {
      fetchReports();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, setShouldRefetch]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Game Name</TableHead>
          <TableHead>Report Date</TableHead>
          <TableHead>Reported By</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>{report.gameName}</TableCell>
            <TableCell>{report.reportDate}</TableCell>
            <TableCell>{report.reportedBy}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}