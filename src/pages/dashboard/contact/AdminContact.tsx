import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  MessageSquare, 
  AlertCircle,
  ArrowUpDown,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Contact {
  _id: string;
  subject: string;
  priorityLevel: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  attachment?: string;
  createdAt: string;
}

interface ContactsResponse {
  contacts: Contact[];
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact-admin`);
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data: ContactsResponse = await response.json();
      setContacts(data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch = contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || contact.priorityLevel === priorityFilter;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return sortOrder === 'desc'
          ? priorityOrder[b.priorityLevel] - priorityOrder[a.priorityLevel]
          : priorityOrder[a.priorityLevel] - priorityOrder[b.priorityLevel];
      }
    });

  // Priority badge variants
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <Card className="mb-6 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center text-2xl md:text-3xl">
                  <MessageSquare className="w-6 h-6 md:w-8 md:h-8 mr-3 text-blue-600" />
                  Contact Submissions
                </CardTitle>
                <CardDescription className="text-base md:text-lg mt-2">
                  Manage and review all contact form submissions
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Button 
                  onClick={fetchContacts} 
                  variant="outline" 
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters and Search */}
        <Card className="mb-6 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by subject or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Priority Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    Priority: {priorityFilter === 'all' ? 'All' : priorityFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPriorityFilter('all')}>
                    All Priorities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('urgent')}>
                    Urgent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('high')}>
                    High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('low')}>
                    Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Sort: {sortBy === 'date' ? 'Date' : 'Priority'} ({sortOrder})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => { setSortBy('date'); setSortOrder('desc'); }}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('date'); setSortOrder('asc'); }}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('priority'); setSortOrder('desc'); }}>
                    Priority (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('priority'); setSortOrder('asc'); }}>
                    Priority (Low to High)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">
                {contacts.length}
              </div>
              <p className="text-sm text-gray-600">Total</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-red-600">
                {contacts.filter(c => c.priorityLevel === 'urgent').length}
              </div>
              <p className="text-sm text-gray-600">Urgent</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">
                {contacts.filter(c => c.priorityLevel === 'high').length}
              </div>
              <p className="text-sm text-gray-600">High</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600">
                {contacts.filter(c => c.priorityLevel === 'medium' || c.priorityLevel === 'low').length}
              </div>
              <p className="text-sm text-gray-600">Normal</p>
            </CardContent>
          </Card>
        </div>

        {/* Contacts List */}
        {loading ? (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="mt-4 text-gray-600">Loading contacts...</p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:gap-6"
          >
            {filteredContacts.length === 0 ? (
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">No contacts found</h3>
                  <p className="text-gray-600 mt-2">
                    {searchTerm || priorityFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'No contact submissions yet'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredContacts.map((contact) => (
                <motion.div key={contact._id} variants={itemVariants}>
                  <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                              {contact.subject}
                            </h3>
                            <Badge 
                              variant={getPriorityVariant(contact.priorityLevel)}
                              className="flex items-center w-fit"
                            >
                              {getPriorityIcon(contact.priorityLevel)}
                              <span className="ml-1 capitalize">{contact.priorityLevel}</span>
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 line-clamp-3 mb-4">
                            {contact.message}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {contact.message.length} characters
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex md:flex-col gap-2">
                          <Button
                            onClick={() => {
                              setSelectedContact(contact);
                              setIsDetailOpen(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1 md:flex-none"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Contact Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedContact && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Contact Details</span>
                    <Badge variant={getPriorityVariant(selectedContact.priorityLevel)}>
                      {selectedContact.priorityLevel.toUpperCase()}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Submitted on {new Date(selectedContact.createdAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Subject</h4>
                    <p className="text-gray-700">{selectedContact.subject}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Priority Level</h4>
                      <Badge variant={getPriorityVariant(selectedContact.priorityLevel)}>
                        {selectedContact.priorityLevel.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Submission Date</h4>
                      <p className="text-gray-700">
                        {new Date(selectedContact.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedContact.attachment && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Attachment</h4>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Attachment
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}