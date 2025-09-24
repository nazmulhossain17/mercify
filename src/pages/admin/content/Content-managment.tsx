/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  type Transition,
  type Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Home,
  Phone,
  User,
  FolderOpen,
  Edit3,
  Save,
  Eye,
  Plus,
  Type,
  ImageIcon,
  Layout,
  Trash2,
  GripVertical,
  Upload,
  Copy,
  Undo,
  Redo,
  AlertCircle,
  Clock,
  Gift,
  Heart,
  Users,
  MapPin,
} from "lucide-react";

interface ContentBlock {
  id: string;
  type:
    | "text"
    | "image"
    | "section"
    | "hero"
    | "donation-form"
    | "impact-cards"
    | "stats"
    | "project-card"
    | "contact-info"
    | "map"
    | "testimonial";
  content: any;
}

interface PageContent {
  title: string;
  metaDescription: string;
  status: "published" | "draft";
  blocks: ContentBlock[];
  lastModified: string;
}

interface SaveState {
  isSaving: boolean;
  lastSaved: string | null;
  hasUnsavedChanges: boolean;
  error: string | null;
}

export default function AdminCMS() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contentFilter, setContentFilter] = useState<
    ContentBlock["type"] | "all"
  >("all");
  const [showTemplates, setShowTemplates] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const [saveState, setSaveState] = useState<SaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      },
    },
    exit: {
      y: -10,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const cardHoverVariants = {
    rest: {
      scale: 1,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    hover: {
      scale: 1.02,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30,
      } as Transition,
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30,
      },
    },
  };

  // const dragVariants = {
  //   drag: {
  //     scale: 1.05,
  //     rotate: 2,
  //     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  //     transition: {
  //       type: "spring",
  //       stiffness: 300,
  //       damping: 20,
  //     },
  //   },
  // };

  // const pulseVariants = {
  //   pulse: {
  //     scale: [1, 1.05, 1],
  //     transition: {
  //       duration: 2,
  //       repeat: Number.POSITIVE_INFINITY,
  //       ease: "easeInOut",
  //     },
  //   },
  // };

  const slideInVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      },
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const fadeInUpVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.9,
      },
    },
  };

  // const scaleInVariants = {
  //   hidden: { scale: 0, opacity: 0 },
  //   visible: {
  //     scale: 1,
  //     opacity: 1,
  //     transition: {
  //       type: "spring",
  //       stiffness: 400,
  //       damping: 25,
  //       mass: 0.6,
  //     },
  //   },
  // };

  const contentTemplates = {
    "donation-hero": {
      type: "hero" as const,
      content: {
        title: "Support Our Community",
        subtitle:
          "Your generous donations help us maintain this platform and support those in need within our community.",
        buttonText: "Donate Now",
        badge: "Support Our Mission • Make a Difference",
        backgroundGradient: "from-orange-50 via-white to-amber-50",
      },
    },
    "contact-hero": {
      type: "hero" as const,
      content: {
        title: "Contact Us",
        subtitle:
          "Have questions? Need help? Our dedicated support team is here to assist you every step of the way.",
        buttonText: "Get In Touch",
        badge: "Get In Touch • We're Here to Help",
        backgroundGradient: "from-emerald-50 via-white to-teal-50",
      },
    },
    "project-card": {
      type: "project-card" as const,
      content: {
        title: "New Project",
        description:
          "Description of the charitable project and its impact on the community.",
        image: "",
        imageAlt: "Project image",
        buttons: [
          { text: "Learn More", color: "bg-green-500 hover:bg-green-600" },
          { text: "Donate Now", color: "bg-pink-500 hover:bg-pink-600" },
        ],
        year: new Date().getFullYear().toString(),
        status: "active",
      },
    },
  };

  const [pageContent, setPageContent] = useState<Record<string, PageContent>>({
    home: {
      title: "Support Our Community",
      metaDescription:
        "Your generous donations help us maintain this platform and support those in need",
      status: "published",
      lastModified: new Date().toISOString(),
      blocks: [
        {
          id: "1",
          type: "hero",
          content: {
            title: "Support Our Community",
            subtitle:
              "Your generous donations help us maintain this platform and support those in need within our community. Every contribution, no matter the size, makes a meaningful impact.",
            buttonText: "Donate Now",
            badge: "Support Our Mission • Make a Difference",
            backgroundGradient: "from-orange-50 via-white to-amber-50",
          },
        },
        {
          id: "2",
          type: "donation-form",
          content: {
            title: "Make a Donation",
            description:
              "Choose your donation amount and help us continue our mission",
            predefinedAmounts: [25, 50, 100, 250, 500, 1000],
            impactText: {
              "25": "Helps process 5 loan applications",
              "50": "Supports platform maintenance for 1 week",
              "100": "Covers verification costs for 20 users",
              "250": "Enables community outreach programs",
            },
          },
        },
        {
          id: "3",
          type: "stats",
          content: {
            title: "Community Stats",
            stats: [
              {
                label: "Active Members",
                value: "1,247",
                color: "text-blue-700",
              },
              {
                label: "Loans Facilitated",
                value: "$2.3M",
                color: "text-blue-700",
              },
              { label: "Success Rate", value: "98%", color: "text-blue-700" },
            ],
          },
        },
        {
          id: "4",
          type: "impact-cards",
          content: {
            title: "Why Your Donation Matters",
            subtitle:
              "Every donation directly supports our mission to provide interest-free financial assistance to those in need",
            cards: [
              {
                icon: "Heart",
                title: "Platform Maintenance",
                description:
                  "Keep our secure platform running smoothly for all users",
                color: "from-red-500 to-pink-600",
              },
              {
                icon: "Users",
                title: "Community Support",
                description:
                  "Fund outreach programs and community education initiatives",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: "Shield",
                title: "Security & Verification",
                description:
                  "Maintain robust security measures and user verification processes",
                color: "from-green-500 to-emerald-600",
              },
            ],
          },
        },
      ],
    },
    contact: {
      title: "Contact Us",
      metaDescription:
        "Get in touch with our team - we're here to help with any questions about our platform",
      status: "published",
      lastModified: new Date().toISOString(),
      blocks: [
        {
          id: "1",
          type: "hero",
          content: {
            title: "Contact Us",
            subtitle:
              "Have questions about Mercy Financials? Need help with your account? Our dedicated support team is here to assist you every step of the way.",
            badge: "Get In Touch • We're Here to Help",
            backgroundGradient: "from-emerald-50 via-white to-teal-50",
          },
        },
        {
          id: "2",
          type: "contact-info",
          content: {
            cards: [
              {
                icon: "Phone",
                title: "Phone",
                details: ["321-314-8170", "321-314-8170"],
                description: "Available 24/7 for urgent matters",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: "Mail",
                title: "Email",
                details: ["info@alamanah.org", "info@alamanah.org"],
                description: "We respond within 24 hours",
                color: "from-purple-500 to-indigo-600",
              },
              {
                icon: "MapPin",
                title: "Address",
                details: ["123 Community Street", "Islamic Center, City 12345"],
                description: "Visit us during office hours",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: "Clock",
                title: "Office Hours",
                details: [
                  "Mon - Fri: 9:00 AM - 6:00 PM",
                  "Sat: 10:00 AM - 4:00 PM",
                ],
                description: "Closed on Sundays and Islamic holidays",
                color: "from-orange-500 to-amber-600",
              },
            ],
          },
        },
        {
          id: "3",
          type: "map",
          content: {
            title: "Find Us Here",
            subtitle:
              "We're conveniently located and ready to serve you. Visit us during our office hours or schedule an appointment.",
            embedUrl:
              "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d32602.582498003045!2d-84.168206!3d33.889438!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5a434e3918a57%3A0xba0c53ef89932760!2s5625%20Nottingham%20Dr%20NW%2C%20Lilburn%2C%20GA%2030047!5e1!3m2!1sen!2sus!4v1755794326581!5m2!1sen!2sus",
            address: "5625 Nottingham Dr NW, Lilburn, GA 30047",
            officeHours: "Mon - Fri: 9:00 AM - 6:00 PM",
          },
        },
      ],
    },
    about: {
      title: "About Us",
      metaDescription:
        "Learn more about our mission, values, and commitment to providing interest-free financial assistance",
      status: "draft",
      lastModified: new Date().toISOString(),
      blocks: [
        {
          id: "1",
          type: "hero",
          content: {
            title: "About Our Mission",
            subtitle:
              "We are dedicated to providing interest-free financial assistance and building a supportive community based on Islamic principles.",
            badge: "Our Story • Our Values",
            backgroundGradient: "from-purple-50 via-white to-indigo-50",
          },
        },
      ],
    },
    project: {
      title: "Our Projects",
      metaDescription:
        "Discover the charitable projects we support - from tree plantation to winter relief programs",
      status: "draft",
      lastModified: new Date().toISOString(),
      blocks: [
        {
          id: "1",
          type: "hero",
          content: {
            title: "Our Projects",
            subtitle:
              "Discover the meaningful projects we support in communities around the world. Every donation helps us make a real difference.",
            badge: "Making a Difference • Global Impact",
            backgroundGradient: "from-green-50 via-white to-emerald-50",
          },
        },
        {
          id: "2",
          type: "project-card",
          content: {
            title: "Tree Plantation Project 2021",
            description:
              "The Messenger of Allah, Muhammad (PBUH), has ordered us to plant trees even as the world comes to an end. Insha Allah, we'll be planting a variety of wood/fruit trees in the surroundings of some masjids, madrasahs (schools), orphan houses, graveyards, etc.",
            image:
              "https://mercyfi.com/wp-content/uploads/2020/07/Qurbani-Copy-768x317.jpg",
            imageAlt: "Hands planting a small tree sapling in soil",
            buttons: [
              { text: "Learn More", color: "bg-green-500 hover:bg-green-600" },
              {
                text: "Let's Plant A Tree From Allah!",
                color: "bg-pink-500 hover:bg-pink-600",
              },
            ],
            year: "2021",
            status: "completed",
          },
        },
      ],
    },
  });

  const [history, setHistory] = useState<Record<string, PageContent[]>>({
    home: [],
    contact: [],
    about: [],
    project: [],
  });
  const [historyIndex, setHistoryIndex] = useState<Record<string, number>>({
    home: -1,
    contact: -1,
    about: -1,
    project: -1,
  });

  const pages = [
    {
      id: "home",
      name: "Home Page",
      icon: Home,
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "contact",
      name: "Contact Page",
      icon: Phone,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "about",
      name: "About Page",
      icon: User,
      color: "from-purple-500 to-violet-600",
    },
    {
      id: "project",
      name: "Project Page",
      icon: FolderOpen,
      color: "from-orange-500 to-amber-600",
    },
  ];

  const currentPageContent = pageContent[selectedPage];

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (saveState.hasUnsavedChanges && !saveState.isSaving) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [saveState.hasUnsavedChanges, saveState.isSaving]);

  const validateContentBlock = useCallback((block: ContentBlock): string[] => {
    const errors: string[] = [];

    switch (block.type) {
      case "hero":
        if (!block.content.title?.trim()) errors.push("Hero title is required");
        if (!block.content.subtitle?.trim())
          errors.push("Hero subtitle is required");
        break;
      case "text":
        if (!block.content.heading?.trim())
          errors.push("Text heading is required");
        if (!block.content.text?.trim())
          errors.push("Text content is required");
        break;
      case "image":
        if (!block.content.src?.trim()) errors.push("Image URL is required");
        if (!block.content.alt?.trim())
          errors.push("Image alt text is required");
        break;
      case "donation-form":
        if (!block.content.title?.trim())
          errors.push("Donation form title is required");
        if (!block.content.predefinedAmounts?.length)
          errors.push("At least one predefined amount is required");
        break;
      case "project-card":
        if (!block.content.title?.trim())
          errors.push("Project title is required");
        if (!block.content.description?.trim())
          errors.push("Project description is required");
        break;
      case "contact-info":
        if (!block.content.cards?.length)
          errors.push("At least one contact card is required");
        break;
      case "map":
        if (!block.content.embedUrl?.trim())
          errors.push("Map embed URL is required");
        if (!block.content.address?.trim()) errors.push("Address is required");
        break;
    }

    return errors;
  }, []);

  const addToHistory = useCallback(
    (pageId: string, content: PageContent) => {
      setHistory((prev) => {
        const pageHistory = prev[pageId] || [];
        const currentIndex = historyIndex[pageId];

        // Remove any history after current index (when making new changes after undo)
        const newHistory = pageHistory.slice(0, currentIndex + 1);
        newHistory.push({ ...content });

        // Keep only last 20 history entries
        if (newHistory.length > 20) {
          newHistory.shift();
        }

        return { ...prev, [pageId]: newHistory };
      });

      setHistoryIndex((prev) => ({
        ...prev,
        [pageId]: Math.min((prev[pageId] || -1) + 1, 19),
      }));
    },
    [historyIndex]
  );

  const updatePageField = useCallback(
    (field: keyof PageContent, value: any) => {
      const oldContent = pageContent[selectedPage];
      const newContent = {
        ...oldContent,
        [field]: value,
        lastModified: new Date().toISOString(),
      };

      // Add to history before making changes
      addToHistory(selectedPage, oldContent);

      setPageContent((prev) => ({
        ...prev,
        [selectedPage]: newContent,
      }));

      setSaveState((prev) => ({
        ...prev,
        hasUnsavedChanges: true,
        error: null,
      }));
    },
    [selectedPage, pageContent, addToHistory]
  );

  const addContentBlock = useCallback(
    (type: ContentBlock["type"]) => {
      const newBlock: ContentBlock = {
        id: Date.now().toString(),
        type,
        content: getDefaultContent(type),
      };

      updatePageField("blocks", [...currentPageContent.blocks, newBlock]);
    },
    [currentPageContent.blocks, updatePageField]
  );

  const updateContentBlock = useCallback(
    (blockId: string, content: any) => {
      const updatedBlocks = currentPageContent.blocks.map((block) =>
        block.id === blockId ? { ...block, content } : block
      );
      updatePageField("blocks", updatedBlocks);
    },
    [currentPageContent.blocks, updatePageField]
  );

  const deleteContentBlock = useCallback(
    (blockId: string) => {
      const updatedBlocks = currentPageContent.blocks.filter(
        (block) => block.id !== blockId
      );
      updatePageField("blocks", updatedBlocks);
    },
    [currentPageContent.blocks, updatePageField]
  );

  const duplicateContentBlock = useCallback(
    (blockId: string) => {
      const blockToDuplicate = currentPageContent.blocks.find(
        (block) => block.id === blockId
      );
      if (blockToDuplicate) {
        const duplicatedBlock: ContentBlock = {
          ...blockToDuplicate,
          id: Date.now().toString(),
          content: { ...blockToDuplicate.content },
        };

        const blockIndex = currentPageContent.blocks.findIndex(
          (block) => block.id === blockId
        );
        const updatedBlocks = [
          ...currentPageContent.blocks.slice(0, blockIndex + 1),
          duplicatedBlock,
          ...currentPageContent.blocks.slice(blockIndex + 1),
        ];

        updatePageField("blocks", updatedBlocks);
      }
    },
    [currentPageContent.blocks, updatePageField]
  );

  const handleDragStart = (blockId: string) => {
    setDraggedBlock(blockId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();

    if (!draggedBlock || draggedBlock === targetBlockId) {
      setDraggedBlock(null);
      return;
    }

    const blocks = [...currentPageContent.blocks];
    const draggedIndex = blocks.findIndex((block) => block.id === draggedBlock);
    const targetIndex = blocks.findIndex((block) => block.id === targetBlockId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItem] = blocks.splice(draggedIndex, 1);
      blocks.splice(targetIndex, 0, draggedItem);

      updatePageField("blocks", blocks);
    }

    setDraggedBlock(null);
  };

  const handleUndo = () => {
    const currentIndex = historyIndex[selectedPage];
    if (currentIndex > 0) {
      const previousContent = history[selectedPage][currentIndex - 1];
      setPageContent((prev) => ({
        ...prev,
        [selectedPage]: { ...previousContent },
      }));
      setHistoryIndex((prev) => ({
        ...prev,
        [selectedPage]: currentIndex - 1,
      }));
      setSaveState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    }
  };

  const handleRedo = () => {
    const currentIndex = historyIndex[selectedPage];
    const pageHistory = history[selectedPage] || [];
    if (currentIndex < pageHistory.length - 1) {
      const nextContent = pageHistory[currentIndex + 1];
      setPageContent((prev) => ({
        ...prev,
        [selectedPage]: { ...nextContent },
      }));
      setHistoryIndex((prev) => ({
        ...prev,
        [selectedPage]: currentIndex + 1,
      }));
      setSaveState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    }
  };

  const handleSave = async () => {
    setSaveState((prev) => ({ ...prev, isSaving: true, error: null }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would be an API call
      // await fetch('/api/pages', { method: 'POST', body: JSON.stringify(pageContent) })

      setSaveState((prev) => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date().toLocaleTimeString(),
        hasUnsavedChanges: false,
        error: null,
      }));
    } catch (error) {
      setSaveState((prev) => ({
        ...prev,
        isSaving: false,
        error: "Failed to save changes. Please try again.",
      }));
      console.error("Save failed:", error);
    }
  };

  const handleAutoSave = async () => {
    setSaveState((prev) => ({ ...prev, isSaving: true }));

    try {
      // Simulate auto-save API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSaveState((prev) => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date().toLocaleTimeString(),
        hasUnsavedChanges: false,
      }));
    } catch (error) {
      setSaveState((prev) => ({ ...prev, isSaving: false }));
      console.error("Auto-save failed:", error);
    }
  };

  const handleBulkDelete = useCallback(() => {
    if (selectedBlocks.length === 0) return;

    const updatedBlocks = currentPageContent.blocks.filter(
      (block) => !selectedBlocks.includes(block.id)
    );
    updatePageField("blocks", updatedBlocks);
    setSelectedBlocks([]);
    setIsSelectionMode(false);
  }, [selectedBlocks, currentPageContent.blocks, updatePageField]);

  const handleBulkDuplicate = useCallback(() => {
    if (selectedBlocks.length === 0) return;

    const blocksToAdd: ContentBlock[] = [];
    selectedBlocks.forEach((blockId) => {
      const blockToDuplicate = currentPageContent.blocks.find(
        (block) => block.id === blockId
      );
      if (blockToDuplicate) {
        blocksToAdd.push({
          ...blockToDuplicate,
          id: `${Date.now()}-${Math.random()}`,
          content: { ...blockToDuplicate.content },
        });
      }
    });

    updatePageField("blocks", [...currentPageContent.blocks, ...blocksToAdd]);
    setSelectedBlocks([]);
    setIsSelectionMode(false);
  }, [selectedBlocks, currentPageContent.blocks, updatePageField]);

  const handleExportContent = useCallback(() => {
    const exportData = {
      page: selectedPage,
      content: currentPageContent,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPage}-content-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedPage, currentPageContent]);

  const handleImportContent = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);
          if (importData.content && importData.content.blocks) {
            // Validate imported content
            const errors: string[] = [];
            importData.content.blocks.forEach(
              (block: ContentBlock, index: number) => {
                const blockErrors = validateContentBlock(block);
                if (blockErrors.length > 0) {
                  errors.push(`Block ${index + 1}: ${blockErrors.join(", ")}`);
                }
              }
            );

            if (errors.length > 0) {
              setSaveState((prev) => ({
                ...prev,
                error: `Import validation failed: ${errors.join("; ")}`,
              }));
              return;
            }

            // Import successful
            setPageContent((prev) => ({
              ...prev,
              [selectedPage]: {
                ...importData.content,
                lastModified: new Date().toISOString(),
              },
            }));
            setSaveState((prev) => ({ ...prev, hasUnsavedChanges: true }));
          }
        } catch (error) {
          setSaveState((prev) => ({
            ...prev,
            error: "Failed to import content. Invalid file format.",
          }));
          console.error("Failed to import content:", error);
        }
      };
      reader.readAsText(file);

      // Reset input
      event.target.value = "";
    },
    [selectedPage, validateContentBlock]
  );

  const filteredBlocks = useMemo(() => {
    let blocks = currentPageContent.blocks;

    // Apply type filter
    if (contentFilter !== "all") {
      blocks = blocks.filter((block) => block.type === contentFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      blocks = blocks.filter((block) => {
        const searchableContent = JSON.stringify(block.content).toLowerCase();
        return searchableContent.includes(query) || block.type.includes(query);
      });
    }

    return blocks;
  }, [currentPageContent.blocks, contentFilter, searchQuery]);

  useEffect(() => {
    const errors: Record<string, string[]> = {};
    currentPageContent.blocks.forEach((block) => {
      const blockErrors = validateContentBlock(block);
      if (blockErrors.length > 0) {
        errors[block.id] = blockErrors;
      }
    });
    setValidationErrors(errors);
  }, [currentPageContent.blocks, validateContentBlock]);

  const applyTemplate = useCallback(
    (templateKey: keyof typeof contentTemplates) => {
      const template = contentTemplates[templateKey];
      const newBlock: ContentBlock = {
        id: Date.now().toString(),
        type: template.type,
        content: { ...template.content },
      };

      updatePageField("blocks", [...currentPageContent.blocks, newBlock]);
      setShowTemplates(false);
    },
    [currentPageContent.blocks, updatePageField]
  );

  const toggleBlockSelection = useCallback((blockId: string) => {
    setSelectedBlocks((prev) =>
      prev.includes(blockId)
        ? prev.filter((id) => id !== blockId)
        : [...prev, blockId]
    );
  }, []);

  const selectAllBlocks = useCallback(() => {
    setSelectedBlocks(filteredBlocks.map((block) => block.id));
  }, [filteredBlocks]);

  const clearSelection = useCallback(() => {
    setSelectedBlocks([]);
    setIsSelectionMode(false);
  }, []);

  const getDefaultContent = (type: ContentBlock["type"]) => {
    switch (type) {
      case "text":
        return {
          heading: "New Heading",
          text: "Enter your text content here...",
        };
      case "image":
        return { src: "", alt: "", caption: "" };
      case "section":
        return { heading: "New Section", content: "Section content..." };
      case "hero":
        return {
          title: "Hero Title",
          subtitle: "Hero subtitle",
          buttonText: "Learn More",
          badge: "New Badge",
          backgroundGradient: "from-blue-50 via-white to-cyan-50",
        };
      case "donation-form":
        return {
          title: "Make a Donation",
          description: "Choose your donation amount",
          predefinedAmounts: [25, 50, 100, 250],
          impactText: {},
        };
      case "impact-cards":
        return {
          title: "Our Impact",
          subtitle: "See how your contributions make a difference",
          cards: [],
        };
      case "stats":
        return {
          title: "Statistics",
          stats: [],
        };
      case "project-card":
        return {
          title: "New Project",
          description: "Project description...",
          image: "",
          imageAlt: "",
          buttons: [],
          year: new Date().getFullYear().toString(),
          status: "active",
        };
      case "contact-info":
        return {
          cards: [],
        };
      case "map":
        return {
          title: "Find Us",
          subtitle: "Visit our location",
          embedUrl: "",
          address: "",
          officeHours: "",
        };
      case "testimonial":
        return {
          quote: "Enter testimonial quote...",
          author: "Author Name",
          role: "Role/Title",
          image: "",
        };
      default:
        return {};
    }
  };

  const renderContentBlockEditor = (block: ContentBlock) => {
    switch (block.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Heading</Label>
              <Input
                value={block.content.heading || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    heading: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Text Content</Label>
              <Textarea
                value={block.content.text || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    text: e.target.value,
                  })
                }
                className="mt-1 min-h-[120px]"
              />
            </div>
          </div>
        );

      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Badge Text</Label>
              <Input
                value={block.content.badge || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    badge: e.target.value,
                  })
                }
                className="mt-1"
                placeholder="Support Our Mission • Make a Difference"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Hero Title</Label>
              <Input
                value={block.content.title || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    title: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Subtitle</Label>
              <Textarea
                value={block.content.subtitle || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    subtitle: e.target.value,
                  })
                }
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Button Text</Label>
              <Input
                value={block.content.buttonText || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    buttonText: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Background Gradient</Label>
              <select
                value={
                  block.content.backgroundGradient ||
                  "from-blue-50 via-white to-cyan-50"
                }
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    backgroundGradient: e.target.value,
                  })
                }
                className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white mt-1"
              >
                <option value="from-orange-50 via-white to-amber-50">
                  Orange to Amber
                </option>
                <option value="from-emerald-50 via-white to-teal-50">
                  Emerald to Teal
                </option>
                <option value="from-purple-50 via-white to-indigo-50">
                  Purple to Indigo
                </option>
                <option value="from-green-50 via-white to-emerald-50">
                  Green to Emerald
                </option>
                <option value="from-blue-50 via-white to-cyan-50">
                  Blue to Cyan
                </option>
              </select>
            </div>
          </div>
        );

      case "donation-form":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Form Title</Label>
              <Input
                value={block.content.title || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    title: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={block.content.description || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    description: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Predefined Amounts (comma-separated)
              </Label>
              <Input
                value={block.content.predefinedAmounts?.join(", ") || ""}
                onChange={(e) => {
                  const amounts = e.target.value
                    .split(",")
                    .map((a) => Number.parseInt(a.trim()))
                    .filter((a) => !isNaN(a));
                  updateContentBlock(block.id, {
                    ...block.content,
                    predefinedAmounts: amounts,
                  });
                }}
                className="mt-1"
                placeholder="25, 50, 100, 250, 500, 1000"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Impact Text (JSON format)
              </Label>
              <Textarea
                value={JSON.stringify(block.content.impactText || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateContentBlock(block.id, {
                      ...block.content,
                      impactText: parsed,
                    });
                  } catch (error) {
                    // Invalid JSON, don't update
                    console.error(error);
                  }
                }}
                className="mt-1 min-h-[100px] font-mono text-sm"
                placeholder='{"25": "Helps process 5 loan applications"}'
              />
            </div>
          </div>
        );

      case "project-card":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Project Title</Label>
              <Input
                value={block.content.title || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    title: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={block.content.description || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    description: e.target.value,
                  })
                }
                className="mt-1 min-h-[120px]"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Image URL</Label>
              <Input
                value={block.content.image || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    image: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Image Alt Text</Label>
              <Input
                value={block.content.imageAlt || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    imageAlt: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Year</Label>
                <Input
                  value={block.content.year || ""}
                  onChange={(e) =>
                    updateContentBlock(block.id, {
                      ...block.content,
                      year: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <select
                  value={block.content.status || "active"}
                  onChange={(e) =>
                    updateContentBlock(block.id, {
                      ...block.content,
                      status: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white mt-1"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">
                Buttons (JSON format)
              </Label>
              <Textarea
                value={JSON.stringify(block.content.buttons || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateContentBlock(block.id, {
                      ...block.content,
                      buttons: parsed,
                    });
                  } catch (error) {
                    // Invalid JSON, don't update
                    console.error(error);
                  }
                }}
                className="mt-1 min-h-[80px] font-mono text-sm"
                placeholder='[{"text": "Learn More", "color": "bg-green-500 hover:bg-green-600"}]'
              />
            </div>
          </div>
        );

      case "contact-info":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">
                Contact Information Cards (JSON format)
              </Label>
              <Textarea
                value={JSON.stringify(block.content.cards || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateContentBlock(block.id, {
                      ...block.content,
                      cards: parsed,
                    });
                  } catch (error) {
                    // Invalid JSON, don't update
                    console.error(error);
                  }
                }}
                className="mt-1 min-h-[200px] font-mono text-sm"
                placeholder='[{"icon": "Phone", "title": "Phone", "details": ["123-456-7890"], "description": "Available 24/7"}]'
              />
            </div>
          </div>
        );

      case "map":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Section Title</Label>
              <Input
                value={block.content.title || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    title: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Subtitle</Label>
              <Textarea
                value={block.content.subtitle || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    subtitle: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Google Maps Embed URL
              </Label>
              <Textarea
                value={block.content.embedUrl || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    embedUrl: e.target.value,
                  })
                }
                className="mt-1 min-h-[80px]"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Address</Label>
              <Input
                value={block.content.address || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    address: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Office Hours</Label>
              <Input
                value={block.content.officeHours || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    officeHours: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Section Title</Label>
              <Input
                value={block.content.title || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    title: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Statistics (JSON format)
              </Label>
              <Textarea
                value={JSON.stringify(block.content.stats || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateContentBlock(block.id, {
                      ...block.content,
                      stats: parsed,
                    });
                  } catch (error) {
                    // Invalid JSON, don't update
                    console.error(error);
                  }
                }}
                className="mt-1 min-h-[120px] font-mono text-sm"
                placeholder='[{"label": "Active Members", "value": "1,247", "color": "text-blue-700"}]'
              />
            </div>
          </div>
        );

      case "impact-cards":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Section Title</Label>
              <Input
                value={block.content.title || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    title: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Subtitle</Label>
              <Textarea
                value={block.content.subtitle || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    subtitle: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Impact Cards (JSON format)
              </Label>
              <Textarea
                value={JSON.stringify(block.content.cards || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateContentBlock(block.id, {
                      ...block.content,
                      cards: parsed,
                    });
                  } catch (error) {
                    // Invalid JSON, don't update
                    console.error(error);
                  }
                }}
                className="mt-1 min-h-[150px] font-mono text-sm"
                placeholder='[{"icon": "Heart", "title": "Platform Maintenance", "description": "Keep our platform running", "color": "from-red-500 to-pink-600"}]'
              />
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Image URL</Label>
              <Input
                value={block.content.src || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    src: e.target.value,
                  })
                }
                className="mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Alt Text</Label>
              <Input
                value={block.content.alt || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    alt: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Caption</Label>
              <Input
                value={block.content.caption || ""}
                onChange={(e) =>
                  updateContentBlock(block.id, {
                    ...block.content,
                    caption: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </div>
        );

      default:
        return <div>Unknown block type</div>;
    }
  };

  const getBlockIcon = (type: ContentBlock["type"]) => {
    switch (type) {
      case "text":
        return Type;
      case "image":
        return ImageIcon;
      case "section":
        return Layout;
      case "hero":
        return Layout;
      case "donation-form":
        return Gift;
      case "impact-cards":
        return Heart;
      case "stats":
        return Users;
      case "project-card":
        return FolderOpen;
      case "contact-info":
        return Phone;
      case "map":
        return MapPin;
      case "testimonial":
        return User;
      default:
        return Type;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          <motion.aside
            variants={slideInVariants as Variants}
            initial="hidden"
            animate={isSidebarOpen ? "visible" : "hidden"}
            exit="exit"
            className="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 lg:translate-x-0"
          >
            <div className="flex flex-col h-full pt-20 lg:pt-6">
              <div className="px-4 mb-6">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-semibold text-gray-900 mb-4"
                >
                  Pages
                </motion.h2>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {pages.map((page, index) => (
                    <motion.div
                      key={page.id}
                      variants={itemVariants as Variants}
                      custom={index}
                    >
                      <motion.div
                        variants={cardHoverVariants as any}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant={
                            selectedPage === page.id ? "default" : "ghost"
                          }
                          onClick={() => {
                            setSelectedPage(page.id);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full justify-start h-12 ${
                            selectedPage === page.id
                              ? `bg-gradient-to-r ${page.color} text-white shadow-lg`
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <motion.div
                            animate={
                              selectedPage === page.id
                                ? { rotate: [0, 10, 0] }
                                : {}
                            }
                            transition={{ duration: 0.3 }}
                          >
                            <page.icon className="w-5 h-5 mr-3" />
                          </motion.div>
                          {page.name}
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="px-4 mt-auto pb-6">
                <motion.div
                  variants={fadeInUpVariants as Variants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <motion.div
                          className="text-2xl font-bold text-blue-700"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        >
                          {Object.keys(pageContent).length}
                        </motion.div>
                        <div className="text-sm text-blue-600">
                          Pages Managed
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.aside>
        </AnimatePresence>

        {/* Overlay for mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPage}
                variants={fadeInUpVariants as Variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Edit {pages.find((p) => p.id === selectedPage)?.name}
                      </h1>
                      <p className="text-gray-600">
                        Manage content, layout, and settings for this page
                      </p>
                    </motion.div>
                    <motion.div
                      className="flex gap-3"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        variants={buttonVariants as any}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleUndo}
                          disabled={historyIndex[selectedPage] <= 0}
                          className="bg-transparent"
                        >
                          <Undo className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={buttonVariants as any}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRedo}
                          disabled={
                            historyIndex[selectedPage] >=
                            (history[selectedPage]?.length || 0) - 1
                          }
                          className="bg-transparent"
                        >
                          <Redo className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={buttonVariants as any}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-none bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={buttonVariants as any}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          onClick={handleSave}
                          disabled={
                            saveState.isSaving ||
                            !saveState.hasUnsavedChanges ||
                            Object.keys(validationErrors).length > 0
                          }
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex-1 sm:flex-none"
                        >
                          {saveState.isSaving ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                              >
                                <Clock className="w-4 h-4 mr-2" />
                              </motion.div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="mb-6 flex flex-col sm:flex-row gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex-1">
                    <Input
                      placeholder="Search content blocks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={contentFilter}
                      onChange={(e) =>
                        setContentFilter(
                          e.target.value as ContentBlock["type"] | "all"
                        )
                      }
                      className="h-10 px-3 rounded-md border border-gray-200 bg-white"
                    >
                      <option value="all">All Types</option>
                      <option value="hero">Hero</option>
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="section">Section</option>
                      {selectedPage === "home" && (
                        <>
                          <option value="donation-form">Donation Form</option>
                          <option value="stats">Stats</option>
                          <option value="impact-cards">Impact Cards</option>
                        </>
                      )}
                      {selectedPage === "project" && (
                        <option value="project-card">Project Card</option>
                      )}
                      {selectedPage === "contact" && (
                        <>
                          <option value="contact-info">Contact Info</option>
                          <option value="map">Map</option>
                        </>
                      )}
                    </select>
                    <motion.div
                      variants={buttonVariants as any}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSelectionMode(!isSelectionMode)}
                        className={
                          isSelectionMode ? "bg-blue-50 border-blue-300" : ""
                        }
                      >
                        {isSelectionMode ? "Exit Selection" : "Select Mode"}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {isSelectionMode && (
                    <motion.div
                      className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.span
                            className="text-sm font-medium text-blue-800"
                            key={selectedBlocks.length}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {selectedBlocks.length} of {filteredBlocks.length}{" "}
                            blocks selected
                          </motion.span>
                          <div className="flex gap-2">
                            <motion.div
                              variants={buttonVariants as any}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={selectAllBlocks}
                              >
                                Select All
                              </Button>
                            </motion.div>
                            <motion.div
                              variants={buttonVariants as any}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={clearSelection}
                              >
                                Clear
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.div
                            variants={buttonVariants as any}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleBulkDuplicate}
                              disabled={selectedBlocks.length === 0}
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Duplicate
                            </Button>
                          </motion.div>
                          <motion.div
                            variants={buttonVariants as any}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleBulkDelete}
                              disabled={selectedBlocks.length === 0}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 xl:grid-cols-3 gap-6"
                >
                  {/* Main Editor */}
                  <motion.div
                    variants={itemVariants as any}
                    className="xl:col-span-2"
                  >
                    <motion.div
                      variants={cardHoverVariants as any}
                      initial="rest"
                      whileHover="hover"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-blue-600" />
                            Content Blocks
                            {filteredBlocks.length !==
                              currentPageContent.blocks.length && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 25,
                                }}
                              >
                                <Badge variant="outline" className="ml-2">
                                  {filteredBlocks.length} of{" "}
                                  {currentPageContent.blocks.length}
                                </Badge>
                              </motion.div>
                            )}
                          </CardTitle>
                          <div className="flex gap-2">
                            <motion.div
                              variants={buttonVariants as any}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowTemplates(!showTemplates)}
                              >
                                <Layout className="w-4 h-4 mr-1" />
                                Templates
                              </Button>
                            </motion.div>
                            <motion.div
                              variants={buttonVariants as any}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addContentBlock("text")}
                              >
                                <Type className="w-4 h-4 mr-1" />
                                Text
                              </Button>
                            </motion.div>
                            <motion.div
                              variants={buttonVariants as any}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addContentBlock("image")}
                              >
                                <ImageIcon className="w-4 h-4 mr-1" />
                                Image
                              </Button>
                            </motion.div>
                            <motion.div
                              variants={buttonVariants as any}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addContentBlock("section")}
                              >
                                <Layout className="w-4 h-4 mr-1" />
                                Section
                              </Button>
                            </motion.div>
                            {selectedPage === "home" && (
                              <>
                                <motion.div
                                  variants={buttonVariants as any}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      addContentBlock("donation-form")
                                    }
                                  >
                                    <Gift className="w-4 h-4 mr-1" />
                                    Donation
                                  </Button>
                                </motion.div>
                                <motion.div
                                  variants={buttonVariants as any}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addContentBlock("stats")}
                                  >
                                    <Users className="w-4 h-4 mr-1" />
                                    Stats
                                  </Button>
                                </motion.div>
                              </>
                            )}
                            {selectedPage === "project" && (
                              <motion.div
                                variants={buttonVariants as any}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    addContentBlock("project-card")
                                  }
                                >
                                  <FolderOpen className="w-4 h-4 mr-1" />
                                  Project
                                </Button>
                              </motion.div>
                            )}
                            {selectedPage === "contact" && (
                              <>
                                <motion.div
                                  variants={buttonVariants as any}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      addContentBlock("contact-info")
                                    }
                                  >
                                    <Phone className="w-4 h-4 mr-1" />
                                    Contact Info
                                  </Button>
                                </motion.div>
                                <motion.div
                                  variants={buttonVariants as any}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addContentBlock("map")}
                                  >
                                    <MapPin className="w-4 h-4 mr-1" />
                                    Map
                                  </Button>
                                </motion.div>
                              </>
                            )}
                          </div>
                        </CardHeader>

                        <AnimatePresence>
                          {showTemplates && (
                            <motion.div
                              className="px-6 pb-4"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                                <CardContent className="p-4">
                                  <h4 className="font-semibold text-blue-800 mb-3">
                                    Content Templates
                                  </h4>
                                  <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    {Object.entries(contentTemplates).map(
                                      ([key], index) => (
                                        <motion.div
                                          key={key}
                                          variants={itemVariants as Variants}
                                          custom={index}
                                        >
                                          <motion.div
                                            variants={buttonVariants as any}
                                            initial="rest"
                                            whileHover="hover"
                                            whileTap="tap"
                                          >
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() =>
                                                applyTemplate(
                                                  key as keyof typeof contentTemplates
                                                )
                                              }
                                              className="justify-start bg-white hover:bg-blue-50"
                                            >
                                              <Plus className="w-3 h-3 mr-2" />
                                              {key
                                                .replace("-", " ")
                                                .replace(/\b\w/g, (l) =>
                                                  l.toUpperCase()
                                                )}
                                            </Button>
                                          </motion.div>
                                        </motion.div>
                                      )
                                    )}
                                  </motion.div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                          <AnimatePresence mode="popLayout">
                            {filteredBlocks.length === 0 ? (
                              <motion.div
                                className="text-center py-12"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                              >
                                <motion.div
                                  animate={{ y: [0, -10, 0] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                  }}
                                >
                                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                </motion.div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                  {searchQuery || contentFilter !== "all"
                                    ? "No matching content blocks"
                                    : "No content blocks yet"}
                                </h3>
                                <p className="text-gray-500 mb-4">
                                  {searchQuery || contentFilter !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Add your first content block to get started"}
                                </p>
                                {!searchQuery && contentFilter === "all" && (
                                  <motion.div
                                    variants={buttonVariants as any}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap="tap"
                                  >
                                    <Button
                                      onClick={() => addContentBlock("text")}
                                      className="bg-gradient-to-r from-blue-500 to-cyan-600"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Add Content Block
                                    </Button>
                                  </motion.div>
                                )}
                              </motion.div>
                            ) : (
                              filteredBlocks.map((block) => {
                                const IconComponent = getBlockIcon(block.type);
                                const hasErrors =
                                  validationErrors[block.id]?.length > 0;
                                const isSelected = selectedBlocks.includes(
                                  block.id
                                );
                                const isDragging = draggedBlock === block.id;

                                return (
                                  <motion.div
                                    key={block.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                      opacity: isDragging ? 0.5 : 1,
                                      y: 0,
                                      scale: isDragging ? 1.05 : 1,
                                      rotate: isDragging ? 2 : 0,
                                    }}
                                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                    transition={{
                                      layout: { duration: 0.3 },
                                      opacity: { duration: 0.2 },
                                      scale: { duration: 0.2 },
                                      rotate: { duration: 0.2 },
                                    }}
                                    draggable={!isSelectionMode}
                                    onDragStart={() =>
                                      handleDragStart(block.id)
                                    }
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, block.id)}
                                    className={`${
                                      isSelected ? "ring-2 ring-blue-500" : ""
                                    }`}
                                    style={{
                                      boxShadow: isDragging
                                        ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                        : undefined,
                                    }}
                                  >
                                    <motion.div
                                      variants={cardHoverVariants as Variants}
                                      initial="rest"
                                      whileHover={
                                        !isDragging ? "hover" : "rest"
                                      }
                                    >
                                      <Card
                                        className={`border-l-4 ${
                                          hasErrors
                                            ? "border-l-red-500"
                                            : "border-l-blue-500"
                                        }`}
                                      >
                                        <CardHeader className="pb-3">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              {isSelectionMode && (
                                                <motion.input
                                                  type="checkbox"
                                                  checked={isSelected}
                                                  onChange={() =>
                                                    toggleBlockSelection(
                                                      block.id
                                                    )
                                                  }
                                                  className="w-4 h-4 text-blue-600 rounded"
                                                  whileHover={{ scale: 1.1 }}
                                                  whileTap={{ scale: 0.9 }}
                                                />
                                              )}
                                              {!isSelectionMode && (
                                                <motion.div
                                                  whileHover={{ scale: 1.1 }}
                                                  className="cursor-move"
                                                >
                                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                                </motion.div>
                                              )}
                                              <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.3 }}
                                              >
                                                <IconComponent
                                                  className={`w-4 h-4 ${
                                                    hasErrors
                                                      ? "text-red-600"
                                                      : "text-blue-600"
                                                  }`}
                                                />
                                              </motion.div>
                                              <span className="font-medium capitalize">
                                                {block.type.replace("-", " ")}{" "}
                                                Block
                                              </span>
                                              <AnimatePresence>
                                                {hasErrors && (
                                                  <motion.div
                                                    initial={{
                                                      scale: 0,
                                                      opacity: 0,
                                                    }}
                                                    animate={{
                                                      scale: 1,
                                                      opacity: 1,
                                                    }}
                                                    exit={{
                                                      scale: 0,
                                                      opacity: 0,
                                                    }}
                                                    transition={{
                                                      type: "spring",
                                                      stiffness: 400,
                                                      damping: 25,
                                                    }}
                                                  >
                                                    <Badge
                                                      variant="outline"
                                                      className="text-red-600 border-red-300 text-xs"
                                                    >
                                                      <motion.div
                                                        animate={{
                                                          rotate: [
                                                            0, -10, 10, 0,
                                                          ],
                                                        }}
                                                        transition={{
                                                          duration: 0.5,
                                                          repeat: 2,
                                                        }}
                                                      >
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                      </motion.div>
                                                      {
                                                        validationErrors[
                                                          block.id
                                                        ].length
                                                      }{" "}
                                                      errors
                                                    </Badge>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                            <div className="flex gap-1">
                                              <motion.div
                                                variants={buttonVariants as any}
                                                initial="rest"
                                                whileHover="hover"
                                                whileTap="tap"
                                              >
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() =>
                                                    duplicateContentBlock(
                                                      block.id
                                                    )
                                                  }
                                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                  <Copy className="w-4 h-4" />
                                                </Button>
                                              </motion.div>
                                              <motion.div
                                                variants={buttonVariants as any}
                                                initial="rest"
                                                whileHover="hover"
                                                whileTap="tap"
                                              >
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() =>
                                                    deleteContentBlock(block.id)
                                                  }
                                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </Button>
                                              </motion.div>
                                            </div>
                                          </div>
                                          <AnimatePresence>
                                            {hasErrors && (
                                              <motion.div
                                                className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md"
                                                initial={{
                                                  height: 0,
                                                  opacity: 0,
                                                }}
                                                animate={{
                                                  height: "auto",
                                                  opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                              >
                                                <ul className="text-sm text-red-700 space-y-1">
                                                  {validationErrors[
                                                    block.id
                                                  ].map((error, idx) => (
                                                    <motion.li
                                                      key={idx}
                                                      className="flex items-center gap-1"
                                                      initial={{
                                                        x: -10,
                                                        opacity: 0,
                                                      }}
                                                      animate={{
                                                        x: 0,
                                                        opacity: 1,
                                                      }}
                                                      transition={{
                                                        delay: idx * 0.1,
                                                      }}
                                                    >
                                                      <AlertCircle className="w-3 h-3" />
                                                      {error}
                                                    </motion.li>
                                                  ))}
                                                </ul>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </CardHeader>
                                        <CardContent>
                                          {renderContentBlockEditor(block)}
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  </motion.div>
                                );
                              })
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>

                  {/* Settings Panel */}
                  <motion.div
                    variants={itemVariants as Variants}
                    className="space-y-6"
                  >
                    <motion.div
                      variants={cardHoverVariants as Variants}
                      initial="rest"
                      whileHover="hover"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Page Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Page Title
                            </Label>
                            <Input
                              value={currentPageContent.title}
                              onChange={(e) =>
                                updatePageField("title", e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Meta Description
                            </Label>
                            <Textarea
                              value={currentPageContent.metaDescription}
                              onChange={(e) =>
                                updatePageField(
                                  "metaDescription",
                                  e.target.value
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Status
                            </Label>
                            <select
                              value={currentPageContent.status}
                              onChange={(e) =>
                                updatePageField(
                                  "status",
                                  e.target.value as "published" | "draft"
                                )
                              }
                              className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      variants={cardHoverVariants as Variants}
                      initial="rest"
                      whileHover="hover"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <motion.div
                            variants={buttonVariants as Variants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              variant="outline"
                              className="w-full justify-start bg-transparent"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview Changes
                            </Button>
                          </motion.div>
                          <motion.div
                            variants={buttonVariants as Variants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              variant="outline"
                              onClick={handleExportContent}
                              className="w-full justify-start bg-transparent"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Export Content
                            </Button>
                          </motion.div>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportContent}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <motion.div
                              variants={buttonVariants as Variants}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                variant="outline"
                                className="w-full justify-start bg-transparent"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Import Content
                              </Button>
                            </motion.div>
                          </div>
                          <motion.div
                            variants={buttonVariants as Variants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              variant="outline"
                              className="w-full justify-start bg-transparent"
                            >
                              <FolderOpen className="w-4 h-4 mr-2" />
                              Media Library
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      variants={fadeInUpVariants as Variants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-purple-800">
                            Content Stats
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-purple-600">
                              Content Blocks
                            </span>
                            <motion.span
                              className="font-semibold text-purple-800"
                              key={currentPageContent.blocks.length}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {currentPageContent.blocks.length}
                            </motion.span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-purple-600">
                              Text Blocks
                            </span>
                            <span className="font-semibold text-purple-800">
                              {
                                currentPageContent.blocks.filter(
                                  (b) => b.type === "text"
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-purple-600">
                              Images
                            </span>
                            <span className="font-semibold text-purple-800">
                              {
                                currentPageContent.blocks.filter(
                                  (b) => b.type === "image"
                                ).length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-purple-600">
                              Validation Errors
                            </span>
                            <motion.span
                              className={`font-semibold ${
                                Object.keys(validationErrors).length > 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                              key={Object.keys(validationErrors).length}
                              animate={
                                Object.keys(validationErrors).length > 0
                                  ? { x: [-2, 2, -2, 2, 0] }
                                  : {}
                              }
                              transition={{ duration: 0.4 }}
                            >
                              {Object.keys(validationErrors).length}
                            </motion.span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-purple-600">
                              Last Modified
                            </span>
                            <span className="font-semibold text-purple-800 text-xs">
                              {new Date(
                                currentPageContent.lastModified
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
