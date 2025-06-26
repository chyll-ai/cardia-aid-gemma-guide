
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export const DatabaseInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const initializeDatabase = async () => {
    setIsInitializing(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/init-database', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Database initialized successfully');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to initialize database');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error occurred');
      console.error('Database initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Database Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Initialize the Supabase database with tables and demo data for the Josiane cardiac care app.
        </p>
        
        <Button 
          onClick={initializeDatabase}
          disabled={isInitializing}
          className="w-full"
        >
          {isInitializing ? 'Initializing...' : 'Initialize Database'}
        </Button>

        {status === 'success' && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
