import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLandingContent, useUpdateLandingContent } from '@/hooks/useLandingContent';
import { toast } from 'sonner';

export default function LandingPageEditor() {
  const { data: content, isLoading, refetch } = useLandingContent();
  const updateContent = useUpdateLandingContent();

  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    badge: '',
    cta_primary: '',
    cta_secondary: '',
  });

  const [statsForm, setStatsForm] = useState<Array<{ value: string; label: string }>>([]);

  const [featuresForm, setFeaturesForm] = useState({
    title: '',
    subtitle: '',
    items: [] as Array<{ title: string; description: string }>,
  });

  const [testimonialsForm, setTestimonialsForm] = useState({
    title: '',
    subtitle: '',
    items: [] as Array<{ name: string; role: string; image: string; quote: string }>,
  });

  const [ctaForm, setCtaForm] = useState({
    title: '',
    subtitle: '',
    button_text: '',
  });

  useEffect(() => {
    if (content) {
      if (content.hero) setHeroForm(content.hero);
      if (content.stats) setStatsForm(content.stats);
      if (content.features) setFeaturesForm(content.features);
      if (content.testimonials) setTestimonialsForm(content.testimonials);
      if (content.cta) setCtaForm(content.cta);
    }
  }, [content]);

  const handleSaveHero = async () => {
    try {
      await updateContent.mutateAsync({ sectionKey: 'hero', content: heroForm });
      toast.success('Hero section updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    }
  };

  const handleSaveStats = async () => {
    try {
      await updateContent.mutateAsync({ sectionKey: 'stats', content: statsForm });
      toast.success('Stats section updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    }
  };

  const handleSaveFeatures = async () => {
    try {
      await updateContent.mutateAsync({ sectionKey: 'features', content: featuresForm });
      toast.success('Features section updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    }
  };

  const handleSaveTestimonials = async () => {
    try {
      await updateContent.mutateAsync({ sectionKey: 'testimonials', content: testimonialsForm });
      toast.success('Testimonials section updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    }
  };

  const handleSaveCTA = async () => {
    try {
      await updateContent.mutateAsync({ sectionKey: 'cta', content: ctaForm });
      toast.success('CTA section updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Edit the content displayed on your landing page
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                The main header section of your landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-badge">Badge Text</Label>
                <Input
                  id="hero-badge"
                  value={heroForm.badge}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                  placeholder="e.g., Trusted by 50,000+ learners"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Textarea
                  id="hero-title"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  placeholder="Main headline..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  placeholder="Supporting text..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-cta1">Primary Button</Label>
                  <Input
                    id="hero-cta1"
                    value={heroForm.cta_primary}
                    onChange={(e) => setHeroForm({ ...heroForm, cta_primary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-cta2">Secondary Button</Label>
                  <Input
                    id="hero-cta2"
                    value={heroForm.cta_secondary}
                    onChange={(e) => setHeroForm({ ...heroForm, cta_secondary: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveHero} disabled={updateContent.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics Section</CardTitle>
              <CardDescription>
                Key metrics displayed on the landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsForm.map((stat, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...statsForm];
                        updated[index] = { ...stat, value: e.target.value };
                        setStatsForm(updated);
                      }}
                      placeholder="e.g., 50K+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...statsForm];
                        updated[index] = { ...stat, label: e.target.value };
                        setStatsForm(updated);
                      }}
                      placeholder="e.g., Active Learners"
                    />
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveStats} disabled={updateContent.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Features Section</CardTitle>
              <CardDescription>
                Highlight your platform's key features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={featuresForm.title}
                  onChange={(e) => setFeaturesForm({ ...featuresForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Section Subtitle</Label>
                <Input
                  value={featuresForm.subtitle}
                  onChange={(e) => setFeaturesForm({ ...featuresForm, subtitle: e.target.value })}
                />
              </div>
              {featuresForm.items?.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="space-y-2">
                    <Label>Feature Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...featuresForm.items];
                        updated[index] = { ...item, title: e.target.value };
                        setFeaturesForm({ ...featuresForm, items: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...featuresForm.items];
                        updated[index] = { ...item, description: e.target.value };
                        setFeaturesForm({ ...featuresForm, items: updated });
                      }}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveFeatures} disabled={updateContent.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Testimonials Section</CardTitle>
              <CardDescription>
                Student reviews and success stories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={testimonialsForm.title}
                  onChange={(e) => setTestimonialsForm({ ...testimonialsForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Section Subtitle</Label>
                <Input
                  value={testimonialsForm.subtitle}
                  onChange={(e) => setTestimonialsForm({ ...testimonialsForm, subtitle: e.target.value })}
                />
              </div>
              {testimonialsForm.items?.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...testimonialsForm.items];
                          updated[index] = { ...item, name: e.target.value };
                          setTestimonialsForm({ ...testimonialsForm, items: updated });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={item.role}
                        onChange={(e) => {
                          const updated = [...testimonialsForm.items];
                          updated[index] = { ...item, role: e.target.value };
                          setTestimonialsForm({ ...testimonialsForm, items: updated });
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={item.image}
                      onChange={(e) => {
                        const updated = [...testimonialsForm.items];
                        updated[index] = { ...item, image: e.target.value };
                        setTestimonialsForm({ ...testimonialsForm, items: updated });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quote</Label>
                    <Textarea
                      value={item.quote}
                      onChange={(e) => {
                        const updated = [...testimonialsForm.items];
                        updated[index] = { ...item, quote: e.target.value };
                        setTestimonialsForm({ ...testimonialsForm, items: updated });
                      }}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveTestimonials} disabled={updateContent.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Section</CardTitle>
              <CardDescription>
                The final CTA section at the bottom of the page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cta-title">Title</Label>
                <Input
                  id="cta-title"
                  value={ctaForm.title}
                  onChange={(e) => setCtaForm({ ...ctaForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-subtitle">Subtitle</Label>
                <Textarea
                  id="cta-subtitle"
                  value={ctaForm.subtitle}
                  onChange={(e) => setCtaForm({ ...ctaForm, subtitle: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-button">Button Text</Label>
                <Input
                  id="cta-button"
                  value={ctaForm.button_text}
                  onChange={(e) => setCtaForm({ ...ctaForm, button_text: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveCTA} disabled={updateContent.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
