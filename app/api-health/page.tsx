'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ApiHealthPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<any>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/diagnose')
      const data = await res.json()
      if (data.success) {
        setDiagnostics(data)
      } else {
        setError(data.error || 'Diagnostic failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error running diagnostics')
    } finally {
      setLoading(false)
    }
  }

  const runSaveTest = async () => {
    setLoading(true)
    setError(null)
    try {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'This is a test save from the diagnostic page'
      }

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: testData })
      })

      const data = await res.json()
      setTestResult(data)

      if (data.success) {
        // Try to read back
        const readRes = await fetch('/api/content')
        const readData = await readRes.json()
        if (readData.success && readData.data?.test) {
          setError(null)
        } else {
          setError('Save succeeded but read-back failed - data not persisted')
        }
      } else {
        setError('Save failed: ' + data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Health & Diagnostics</h1>
          <p className="text-slate-600">Check if your content storage system is working properly</p>
        </div>

        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">System Status</TabsTrigger>
            <TabsTrigger value="details">Detailed Info</TabsTrigger>
            <TabsTrigger value="test">Test Save</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current status of your storage system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {diagnostics?.diagnostics?.issues?.length === 0 ? (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      ✓ All systems operational - saves should work correctly
                    </AlertDescription>
                  </Alert>
                ) : diagnostics?.diagnostics?.issues?.length > 0 ? (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-800">
                      <div className="font-bold mb-2">Issues detected:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {diagnostics.diagnostics.issues.map((issue: string, i: number) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ) : null}

                {diagnostics?.recommendations?.length > 0 && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      <div className="font-bold mb-2">Recommendations:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {diagnostics.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="font-mono text-sm">{rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <h3 className="font-bold text-sm mb-2">Data Directory</h3>
                    <p className="text-sm">
                      {diagnostics?.diagnostics?.directories?.data?.exists ? (
                        <span className="text-green-600">✓ Exists and accessible</span>
                      ) : (
                        <span className="text-red-600">✗ Does not exist</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2">Write Permission</h3>
                    <p className="text-sm">
                      {diagnostics?.diagnostics?.permissions?.dataWrite === 'OK' ? (
                        <span className="text-green-600">✓ Writable</span>
                      ) : (
                        <span className="text-red-600">✗ Not writable</span>
                      )}
                    </p>
                  </div>
                </div>

                <Button onClick={runDiagnostics} disabled={loading} className="w-full mt-4">
                  {loading ? 'Running...' : 'Refresh Diagnostics'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>File Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {diagnostics?.diagnostics?.files?.content && (
                  <div className="bg-slate-50 p-4 rounded">
                    <h3 className="font-bold mb-2">content.json</h3>
                    <pre className="text-xs overflow-auto max-h-64">
                      {JSON.stringify(diagnostics.diagnostics.files.content, null, 2)}
                    </pre>
                  </div>
                )}

                {diagnostics?.diagnostics?.diskSpace && (
                  <div className="bg-slate-50 p-4 rounded">
                    <h3 className="font-bold mb-2">Disk Space</h3>
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {diagnostics.diagnostics.diskSpace}
                    </pre>
                  </div>
                )}

                {diagnostics?.diagnostics?.system && (
                  <div className="bg-slate-50 p-4 rounded">
                    <h3 className="font-bold mb-2">System Info</h3>
                    <pre className="text-xs">
                      {JSON.stringify(diagnostics.diagnostics.system, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Save Test</CardTitle>
                <CardDescription>Test if the API can save data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {testResult?.success && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      ✓ Save test successful! Data persisted to disk.
                      <div className="text-xs mt-2 font-mono">{testResult.message}</div>
                    </AlertDescription>
                  </Alert>
                )}

                {testResult && !testResult.success && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertDescription className="text-yellow-800">
                      Save test failed: {testResult.error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button onClick={runSaveTest} disabled={loading} className="w-full">
                  {loading ? 'Testing...' : 'Run Save Test'}
                </Button>

                {testResult && (
                  <div className="bg-slate-50 p-4 rounded max-h-64 overflow-auto">
                    <h3 className="font-bold mb-2 text-sm">Test Result</h3>
                    <pre className="text-xs">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-slate-100">
          <CardHeader>
            <CardTitle className="text-sm">Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Saves work in v0 but not on Hostinger?</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-slate-700">
              <li>SSH into Hostinger and check permissions: <code className="bg-slate-200 px-1 rounded">ls -la data/</code></li>
              <li>Fix permissions: <code className="bg-slate-200 px-1 rounded">chmod 755 data/</code></li>
              <li>Check disk space: <code className="bg-slate-200 px-1 rounded">df -h</code></li>
              <li>Clear temp files: <code className="bg-slate-200 px-1 rounded">rm -f data/.tmp/*</code></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
