import {
  Zap, Palette, ShieldCheck, BarChart3, Smartphone, Headphones,
  Rocket, Star, Heart, Globe, Code, Layers, Lock, Mail, Phone,
  Calendar, Clock, MapPin, Users, Award, TrendingUp, Settings,
  Camera, Video, Music, Book, Briefcase, ShoppingBag, CreditCard,
  Gift, Target, Eye, Bell, MessageSquare, Send, Check, X,
  Plus, Minus, Search, Filter, Download, Upload, Trash2, Edit,
  Copy, Share2, Link, ExternalLink, ArrowRight, ArrowLeft, ArrowUp,
  ArrowDown, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Menu, Home, Info, HelpCircle, ThumbsUp, Sparkles, Sun, Moon,
  Cloud, Wifi, Battery, Cpu, Database, Server, GitBranch, Package,
  FileText, Image, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  RefreshCw, Save, Printer, Flag, Bookmark, Tag, Anchor,
  Compass, Feather, Leaf, Flame, Wind, Droplet, Snowflake, Bolt,
  Activity, Dribbble, Figma, Github, Twitter, Linkedin, Facebook,
  Instagram, Youtube, Slack, Twitch, Coffee, type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Palette, ShieldCheck, BarChart3, Smartphone, Headphones,
  Rocket, Star, Heart, Globe, Code, Layers, Lock, Mail, Phone,
  Calendar, Clock, MapPin, Users, Award, TrendingUp, Settings,
  Camera, Video, Music, Book, Briefcase, ShoppingBag, CreditCard,
  Gift, Target, Eye, Bell, MessageSquare, Send, Check, X,
  Plus, Minus, Search, Filter, Download, Upload, Trash2, Edit,
  Copy, Share2, Link, ExternalLink, ArrowRight, ArrowLeft, ArrowUp,
  ArrowDown, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Menu, Home, Info, HelpCircle, ThumbsUp, Sparkles, Sun, Moon,
  Cloud, Wifi, Battery, Cpu, Database, Server, GitBranch, Package,
  FileText, Image, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  RefreshCw, Save, Printer, Flag, Bookmark, Tag, Anchor,
  Compass, Feather, Leaf, Flame, Wind, Droplet, Snowflake, Bolt,
  Activity, Dribbble, Figma, Github, Twitter, Linkedin, Facebook,
  Instagram, Youtube, Slack, Twitch, Coffee,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}
