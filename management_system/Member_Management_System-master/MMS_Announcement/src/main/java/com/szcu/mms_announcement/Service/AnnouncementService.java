package com.szcu.mms_announcement.Service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.szcu.mms_base.Model.Announcement;
import com.szcu.mms_base.Model.R;

public interface AnnouncementService extends IService<Announcement> {

	R<String> addAnnouncement(Announcement a);

	R<String> deleteAnnouncement(int id);
}
