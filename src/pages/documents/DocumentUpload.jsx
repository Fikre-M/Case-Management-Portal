import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Alert from '../../components/common/Alert'
import { useErrorHandler } from '../../hooks/useErrorHandler'

function DocumentUpload() {
  const navigate = useNavigate()
  const { showSuccess, showWarning } = useErrorHandler('Document Upload')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    relatedTo: '',
  })
  
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

  // Accepted file types
  const acceptedTypes = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'image/jpeg': '.jpg,.jpeg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  }

  const acceptString = Object.values(acceptedTypes).join(',')

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    
    // Validate file types
    const validFiles = files.filter(file => {
      const isValid = Object.keys(acceptedTypes).includes(file.type)
      if (!isValid) {
        showWarning(`File "${file.name}" is not a supported format`)
      }
      return isValid
    })

    // Validate file sizes (max 10MB per file)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const sizedFiles = validFiles.filter(file => {
      if (file.size > maxSize) {
        showWarning(`File "${file.name}" exceeds 10MB limit`)
        return false
      }
      return true
    })

    setSelectedFiles(prev => [...prev, ...sizedFiles])
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type.includes('pdf')) return '📄'
    if (file.type.includes('word')) return '📝'
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return '📊'
    return '📎'
  }

  const simulateUpload = (file, index) => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve()
        }
        setUploadProgress(prev => ({
          ...prev,
          [index]: Math.min(progress, 100)
        }))
      }, 200)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedFiles.length === 0) {
      showWarning('Please select at least one file to upload')
      return
    }

    if (!formData.title.trim()) {
      showWarning('Please enter a document title')
      return
    }

    setUploading(true)

    try {
      // Simulate upload for each file
      for (let i = 0; i < selectedFiles.length; i++) {
        await simulateUpload(selectedFiles[i], i)
      }

      // In production, you would upload to your backend here
      // const formDataToSend = new FormData()
      // formDataToSend.append('title', formData.title)
      // formDataToSend.append('description', formData.description)
      // formDataToSend.append('category', formData.category)
      // formDataToSend.append('relatedTo', formData.relatedTo)
      // selectedFiles.forEach(file => {
      //   formDataToSend.append('files', file)
      // })
      // await uploadService.uploadDocuments(formDataToSend)

      showSuccess(`Successfully uploaded ${selectedFiles.length} document(s)`)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'general',
        relatedTo: '',
      })
      setSelectedFiles([])
      setUploadProgress({})

      // Navigate back after a delay
      setTimeout(() => {
        navigate(-1)
      }, 1500)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Upload Documents
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload documents related to cases, clients, or general files
        </p>
      </div>

      <Alert
        type="info"
        message="Supported formats: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Images (JPG, PNG, GIF, WebP). Max file size: 10MB per file."
        className="mb-6"
      />

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <div className="space-y-4">
            <Input
              label="Document Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter document title"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter document description (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="general">General</option>
                <option value="case">Case Document</option>
                <option value="client">Client Document</option>
                <option value="contract">Contract</option>
                <option value="evidence">Evidence</option>
                <option value="correspondence">Correspondence</option>
              </select>
            </div>

            <Input
              label="Related To (Case/Client ID)"
              value={formData.relatedTo}
              onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
              placeholder="e.g., CASE-2024-001 or Client Name (optional)"
            />
          </div>
        </Card>

        <Card title="Select Files" className="mb-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                accept={acceptString}
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer"
              >
                <div className="text-6xl mb-4">📁</div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Click to select files or drag and drop
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  PDF, Word, Excel, Images (Max 10MB per file)
                </p>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Selected Files ({selectedFiles.length})
                </h3>
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-2xl">{getFileIcon(file)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                        {uploading && uploadProgress[index] !== undefined && (
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div
                                className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[index]}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {Math.round(uploadProgress[index])}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {!uploading && (
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        aria-label="Remove file"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            loading={uploading}
            disabled={selectedFiles.length === 0}
          >
            {uploading ? 'Uploading...' : 'Upload Documents'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={uploading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

DocumentUpload.propTypes = {}

export default DocumentUpload
