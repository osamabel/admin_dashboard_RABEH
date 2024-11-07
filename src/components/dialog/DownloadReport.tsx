// First, add a new function to handle the PDF download
const handleDownloadPDF = async (eventId: string) => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No authentication token found");
  
      // Make GET request with appropriate headers for PDF
      const response = await fetch(`${apiUrl}:${apiPort}/game/event/${eventId}/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }
  
      // Convert the response to blob
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `event-${eventId}.pdf`; // or any other name you want
      
      // Append link to body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };
  
  // Add this button to your table actions or wherever you want to place it
  <Button
    onClick={() => handleDownloadPDF(event.id)}
    className="rounded-[6px]"
    variant="outline"
    size="sm"
  >
    <FileText className="h-4 w-4 mr-2" />
    Download PDF
  </Button>