'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function SmtpCheckPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [data, setData] = useState<any>(null)

  const checkSmtp = async () => {
    setStatus('loading')
    try {
      const response = await fetch('/api/auth/smtp-diagnostic')
      const result = await response.json()
      setData(result)
      setStatus(result.status === 'CONFIGURED' || result.status === 'UNCONFIGURED' ? 'success' : 'error')
    } catch (error) {
      setData({ error: String(error) })
      setStatus('error')
    }
  }

  useEffect(() => {
    checkSmtp()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>SMTP Configuration Check</CardTitle>
            <CardDescription>Verify email service configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader className="w-4 h-4 animate-spin" />
                Checking SMTP configuration...
              </div>
            )}

            {status === 'success' && data && (
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    {data.status === 'UNCONFIGURED' && (
                      <div className="space-y-2">
                        <p className="font-semibold">{data.message}</p>
                        <p className="text-xs">Required environment variables: {data.required?.join(', ')}</p>
                      </div>
                    )}
                    {data.status === 'CONFIGURED' && (
                      <p className="font-semibold text-green-700">{data.message}</p>
                    )}
                  </div>
                </div>

                {data.config && (
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
                    <p><strong>Host:</strong> {data.config.host}</p>
                    <p><strong>Port:</strong> {data.config.port}</p>
                    <p><strong>User:</strong> {data.config.user}</p>
                    <p><strong>From Email:</strong> {data.config.fromEmail}</p>
                    {data.status === 'UNCONFIGURED' && (
                      <p className="text-destructive"><strong>Password:</strong> Not set</p>
                    )}
                  </div>
                )}

                {data.status === 'UNCONFIGURED' && (
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-sm text-destructive">
                    <p className="font-semibold mb-2">Setup Required:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Go to Vercel project settings</li>
                      <li>Add environment variables:
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>HOSTINGER_SMTP_HOST</li>
                          <li>HOSTINGER_SMTP_PORT</li>
                          <li>HOSTINGER_SMTP_USER</li>
                          <li>HOSTINGER_SMTP_PASS</li>
                          <li>HOSTINGER_FROM_EMAIL</li>
                        </ul>
                      </li>
                      <li>Redeploy your application</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">SMTP Connection Error</p>
                  <p className="text-xs mt-1">{data?.error || 'Unknown error'}</p>
                </div>
              </div>
            )}

            <Button onClick={checkSmtp} disabled={status === 'loading'}>
              {status === 'loading' ? 'Checking...' : 'Check Again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
