// components/profile/profile-form.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/features/profile/useProfile';
import { useUpdateProfile } from '@/features/profile/useUpdateProfile';
import { useUpdatePenumpang } from '@/features/profile/useUpdatePenumpang';
import { useUpdatePetugas } from '@/features/profile/useUpdatePetugas';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Loader2, Upload, User as UserIcon } from 'lucide-react';
import { getPhotoUrl } from '@/lib/fetcher';
import { PenumpangData, PetugasData, UpdatePenumpangInput, UpdatePetugasInput } from '@/lib/types/profile';

const profileSchema = z.object({
  // User fields
  username: z.string().min(1, 'Username harus diisi'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
  profile_photo: z.any().optional(),
  
  // Penumpang/Petugas fields
  nama_penumpang: z.string().optional(),
  nama_petugas: z.string().optional(),
  nik: z.string().max(50, 'NIK terlalu panjang').optional(),
  alamat: z.string().optional(),
  no_hp: z.string().max(20, 'Nomor telepon terlalu panjang').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { profile, loading: profileLoading, refetch } = useProfile();
  const { updateProfile, loading: updateUserLoading } = useUpdateProfile();
  const { updatePenumpang, loading: updatePenumpangLoading } = useUpdatePenumpang();
  const { updatePetugas, loading: updatePetugasLoading } = useUpdatePetugas();
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loading = updateUserLoading || updatePenumpangLoading || updatePetugasLoading;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      nama_penumpang: '',
      nama_petugas: '',
      nik: '',
      alamat: '',
      no_hp: '',
    },
  });

  // ✅ Get current user dari localStorage (defined as state/memo)
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  };

  // ✅ Use useMemo atau state untuk currentUser
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Update currentUser when storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const penumpangData = profile?.role === 'penumpang' ? (profile.data as PenumpangData) : null;
  const petugasData = profile?.role === 'petugas' ? (profile.data as PetugasData) : null;

  // Load data ke form saat profile ready
  useEffect(() => {
    if (profile && currentUser) {
      form.reset({
        username: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
        nama_penumpang: penumpangData?.nama_penumpang || '',
        nama_petugas: petugasData?.nama_petugas || '', // Populate nama_petugas
        nik: (penumpangData?.nik || petugasData?.nik) || '',
        alamat: (penumpangData?.alamat || petugasData?.alamat) || '',
        no_hp: (penumpangData?.no_hp || petugasData?.no_hp) || '',
      });
    }
  }, [profile, currentUser, penumpangData, petugasData, form]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Format file harus JPG, PNG, atau JPEG');
        return;
      }

      form.setValue('profile_photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle edit mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Submit form
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      let userUpdateSuccess = false;
      let roleDataUpdateSuccess = false;

      // 1. Update User data (username, email, password, photo)
      const userChanged =
        values.username !== currentUser?.name ||
        values.email !== currentUser?.email ||
        values.password ||
        values.profile_photo;

      if (userChanged) {
        const updateUserData: any = {};

        if (values.username !== currentUser?.name) {
          updateUserData.username = values.username;
        }
        if (values.email !== currentUser?.email) {
          updateUserData.email = values.email;
        }
        if (values.password) {
          updateUserData.password = values.password;
        }
        if (values.profile_photo) {
          updateUserData.profile_photo = values.profile_photo;
        }

        const userResult = await updateProfile(updateUserData);

        if (!userResult) {
          toast.error('Gagal mengupdate data akun');
          return;
        }

        userUpdateSuccess = true;
      } else {
        userUpdateSuccess = true; // No changes needed
      }

      // 2. Update Role specific data (Penumpang / Petugas)
      if (profile?.role === 'penumpang') {
        const penumpangChanged =
          values.nama_penumpang !== penumpangData?.nama_penumpang ||
          values.nik !== penumpangData?.nik ||
          values.alamat !== penumpangData?.alamat ||
          values.no_hp !== penumpangData?.no_hp;

        if (penumpangChanged) {
          const updatePenumpangData: UpdatePenumpangInput = {};

          if (values.nama_penumpang !== penumpangData?.nama_penumpang) {
            updatePenumpangData.nama_penumpang = values.nama_penumpang || undefined;
          }
          if (values.nik !== penumpangData?.nik) {
            updatePenumpangData.nik = values.nik || undefined;
          }
          if (values.alamat !== penumpangData?.alamat) {
            updatePenumpangData.alamat = values.alamat || undefined;
          }
          if (values.no_hp !== penumpangData?.no_hp) {
            updatePenumpangData.no_hp = values.no_hp || undefined;
          }

          const penumpangResult = await updatePenumpang(updatePenumpangData);

          if (!penumpangResult) {
            toast.error('Gagal mengupdate data penumpang');
            return;
          }

           roleDataUpdateSuccess = true;
        } else {
           roleDataUpdateSuccess = true;
        }
      } else if (profile?.role === 'petugas') {
         // Update Petugas Data
         const petugasChanged =
          values.nama_petugas !== petugasData?.nama_petugas ||
          values.nik !== petugasData?.nik ||
          values.alamat !== petugasData?.alamat ||
          values.no_hp !== petugasData?.no_hp;

          if (petugasChanged && petugasData?.id) {
             const updatePetugasData: UpdatePetugasInput = {};

             if (values.nama_petugas !== petugasData?.nama_petugas) {
                updatePetugasData.nama_petugas = values.nama_petugas || undefined;
             }
             if (values.nik !== petugasData?.nik) {
                updatePetugasData.nik = values.nik || undefined;
             }
             if (values.alamat !== petugasData?.alamat) {
                updatePetugasData.alamat = values.alamat || undefined;
             }
             if (values.no_hp !== petugasData?.no_hp) {
                updatePetugasData.no_hp = values.no_hp || undefined;
             }

             const petugasResult = await updatePetugas(petugasData.id, updatePetugasData);

             if (!petugasResult) {
                toast.error('Gagal mengupdate data petugas');
                return;
             }
             roleDataUpdateSuccess = true;
          } else {
             roleDataUpdateSuccess = true;
          }
      } else {
         roleDataUpdateSuccess = true; // Other roles
      }

      // 3. Handle result
      if (userUpdateSuccess && roleDataUpdateSuccess) {
        toast.success('Profil berhasil diupdate');
        setIsEditing(false);
        setPreviewImage(null);
        await refetch();

        // Update currentUser state
        setCurrentUser(getCurrentUser());

        // Trigger storage event untuk update UI lain
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Terjadi kesalahan saat menyimpan');
    }
  };

  if (profileLoading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Info Dasar</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setPreviewImage(null);
                  // Reset form ke data awal
                  form.reset({
                    username: currentUser?.name || '',
                    email: currentUser?.email || '',
                    password: '',
                    nama_penumpang: penumpangData?.nama_penumpang || '',
                    nama_petugas: petugasData?.nama_petugas || '',
                    nik: (penumpangData?.nik || petugasData?.nik) || '',
                    alamat: (penumpangData?.alamat || petugasData?.alamat) || '',
                    no_hp: (penumpangData?.no_hp || petugasData?.no_hp) || '',
                  });
                }}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        {/* Profile Photo */}
        <div>
          <Label>Foto Profil</Label>
          <div className="flex items-center gap-4 mt-3">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={
                  previewImage ||
                  (currentUser?.profile_photo
                    ? getPhotoUrl(currentUser.profile_photo) || undefined
                    : undefined)
                }
              />
              <AvatarFallback>
                <UserIcon className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Foto
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG max 2MB
                </p>
              </div>
            )}
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password - only when editing */}
              {isEditing && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Password Baru (opsional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Kosongkan jika tidak ingin mengubah"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Data Penumpang / Petugas */}
              {(profile?.role === 'penumpang' || profile?.role === 'petugas') && (
                <>
                  <FormField
                    control={form.control}
                    name={profile.role === 'penumpang' ? 'nama_penumpang' : 'nama_petugas'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Masukkan nama lengkap"
                            className={!isEditing ? 'bg-gray-50' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nik"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIK</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="16 digit NIK"
                            maxLength={16}
                            className={!isEditing ? 'bg-gray-50' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="no_hp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="08xxxxxxxxxx"
                            className={!isEditing ? 'bg-gray-50' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alamat"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={!isEditing}
                            placeholder="Alamat lengkap"
                            rows={3}
                            className={!isEditing ? 'bg-gray-50' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}