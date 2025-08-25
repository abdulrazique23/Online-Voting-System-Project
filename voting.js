document.getElementById('submitVote').addEventListener('click', async function() {
    const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
    
    if (!selectedCandidate) {
        alert('Please select a candidate before submitting your vote.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ candidateId: selectedCandidate.value })
        });

        const data = await response.json();
        
        if (data.success) {
            alert('Vote submitted successfully!');
            // Optionally redirect or disable voting
        } else {
            alert('Vote submission failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting your vote. Please try again.');
    }
});
