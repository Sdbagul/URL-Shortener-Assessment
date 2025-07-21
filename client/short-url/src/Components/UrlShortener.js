import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { Link as LinkIcon, ContentCopy as ContentCopyIcon, Check as CheckIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { useState } from 'react';

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = 'http://localhost:9999/short';

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(originalUrl)) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    setLoading(true);
    setError('');
    setShortUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortUrl(data);
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const copyToClipboard = async () => {
    if (shortUrl) {
      const fullShortUrl = `${API_BASE_URL}/${shortUrl.shortCode}`;
      try {
        await navigator.clipboard.writeText(fullShortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const openShortUrl = () => {
    if (shortUrl) {
      window.open(`${API_BASE_URL}/${shortUrl.shortCode}`, '_blank');
    }
  };

  const reset = () => {
    setOriginalUrl('');
    setShortUrl(null);
    setError('');
    setCopied(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)', py: 6, px: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" color="text.primary" gutterBottom>
            URL Shortener
          </Typography>
        </Box>

        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          {!shortUrl ? (
            <Stack spacing={3}>
              <Typography variant="h6" component="label" htmlFor="url" fontWeight="medium" color="text.secondary">
                Enter your long URL
              </Typography>
              <TextField
                id="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com/test"
                fullWidth
                disabled={loading}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <LinkIcon />}
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <CheckIcon sx={{ fontSize: 60, color: 'success.main' }} />
                <Typography variant="h4" component="h2" fontWeight="bold" color="text.primary" gutterBottom>
                  URL Shortened Successfully!
                </Typography>
              </Box>

              <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                  Original URL
                </Typography>
                <Typography sx={{ wordBreak: 'break-all' }}>{shortUrl.originalUrl}</Typography>
              </Box>
              <Box sx={{ bgcolor: 'primary.lightest', p: 2, borderRadius: 2 }}>
                <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                  Short URL
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography fontWeight="medium" color="primary.main" sx={{ wordBreak: 'break-all', flexGrow: 1 }}>
                    {`${API_BASE_URL}/${shortUrl.shortCode}`}
                  </Typography>
                  <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                    <IconButton onClick={copyToClipboard} color="primary">
                      {copied ? <CheckIcon /> : <ContentCopyIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Open short URL">
                    <IconButton onClick={openShortUrl} color="success">
                      <OpenInNewIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              {shortUrl.createdAt && (
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                    Created
                  </Typography>
                  <Typography>{new Date(shortUrl.createdAt).toLocaleString()}</Typography>
                </Box>
              )}
              <Button variant="contained" color="secondary" onClick={reset}>
                Shorten Another URL
              </Button>
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default UrlShortener;